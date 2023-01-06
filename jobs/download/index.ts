import { $, fs, log, LogEntry } from "zx";
import ffprobe from "ffprobe";
import { PrismaClient, TaskStatus, DownloadTask } from "@prisma/client";

const prisma = new PrismaClient({ log: ["info", "warn", "error"] });

const MIN_SIZE = 200 * 1024 * 1024; // 200M
const DOWNLOAD_TIMEOUT = 3600 * 1000; // 1h
const DOWNLOAD_DIR = "/downloads";
const BUCKET = "power-plant-2";

const listFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    return dirent.isFile()
      ? [`${dir}/${dirent.name}`]
      : listFiles(`${dir}/${dirent.name}`);
  });

const scanMetaInfo = async (path: string) => {
  const stat = fs.statSync(path);
  const {
    streams: [res],
  } = await ffprobe(path, { path: "/usr/bin/ffprobe" });

  const [n1, n2] = res.avg_frame_rate.split("/");
  const frameRate = Number(n1) / Number(n2);

  return {
    size: String(stat.size),
    codec: res.codec_name ?? null,
    width: res.width ?? null,
    height: res.height ?? null,
    frameRate: Number.isNaN(frameRate) ? null : frameRate,
    duration: res.duration ?? null,
    bitRate: res.bit_rate ?? null,
  };
};

const getTaskAndStart = async () => {
  const task = await prisma.downloadTask.findFirst({
    where: { status: TaskStatus.Waiting },
  });
  if (!task) return null;

  return prisma.downloadTask.update({
    where: { id: task.id },
    data: {
      status: TaskStatus.Running,
      startedAt: new Date(),
      stoppedAt: null,
    },
    include: {
      product: true,
    },
  });
};

const complete = (id: string) => {
  return prisma.downloadTask.update({
    where: { id },
    data: { status: TaskStatus.Completed, stoppedAt: new Date() },
  });
};

const failedOrCanceled = async (id: string, e: Error) => {
  const task = await prisma.downloadTask.findUniqueOrThrow({
    where: { id },
  });
  if (task.status === TaskStatus.Canceled) {
    return prisma.downloadTask.update({
      where: { id },
      data: {
        stoppedAt: new Date(),
        message: e.message,
      },
    });
  }
  return prisma.downloadTask.update({
    where: { id },
    data: {
      status: TaskStatus.Failed,
      stoppedAt: new Date(),
      message: e.message,
    },
  });
};

const timeout = async (time: number): Promise<string[]> => {
  return new Promise((...[, reject]) => {
    setTimeout(reject, time, new Error(`timeout (${time / 1000}s)`));
  });
};

const monitoringCancel = async (taskId: string): Promise<string[]> => {
  return new Promise((...[, reject]) => {
    setInterval(async () => {
      const canceled = await prisma.downloadTask.findFirst({
        where: { id: taskId, status: TaskStatus.Canceled },
      });
      if (canceled) reject(new Error("canceled"));
    }, 10000);
  });
};

const handleAria2cLog = (taskId: string) => {
  const startAt = new Date().getTime();
  const progress: {
    downloaded: string;
    rate: string;
    connections: string;
    speed: string;
    expects: string;
    duration: number;
  }[] = [];

  return (entry: LogEntry) => {
    if (entry.kind === "stdout") {
      const logText = entry.data.toString();
      if (logText.includes("Download Progress Summary")) {
        const [, downloaded, , rate, connections, , speed, , , expects] =
          logText.match(
            /\s([0-9.GM]+i?B)\/([0-9.GM]+i?B)\((\d+%)\)\sCN:(\d+)\sSD:(\d+)\sDL:([0-9.GMK]+i?B)(\sUL:[0-9.()GMKiB]+)?(\sETA:(\d[0-9dhms]+))?/
          ) ?? [];
        if (rate) {
          progress.push({
            downloaded,
            rate,
            connections,
            speed,
            expects,
            duration: (new Date().getTime() - startAt) / 1000,
          });

          prisma.downloadTask
            .update({
              where: { id: taskId },
              data: {
                progress,
              },
            })
            .then();
        }
      }
    }
    log(entry);
  };
};

const download = async (
  taskId: string,
  url: string,
  dir: string,
  minSize: number
): Promise<string[]> => {
  if (url.endsWith("m3u8")) {
    $`mkdir -p ${dir}`;
    await $`ffmpeg -i ${url} -bsf:a aac_adtstoasc -c copy ${dir}/video.mp4`;
  } else {
    $.log = handleAria2cLog(taskId);
    await $`aria2c -d ${dir} --seed-time=0 --max-overall-upload-limit=1K --show-console-readout=false --summary-interval=60 ${url}`;
    $.log = log;
  }

  return listFiles(dir).filter(
    (filePath) => fs.statSync(filePath).size > minSize
  );
};

const upload = async (filename: string, prefix: string): Promise<string> => {
  const key = `${prefix}/${filename}`;
  await $`aws s3 cp --endpoint-url https://${process.env.R2_CLIENT_ID}.r2.cloudflarestorage.com ${filename} s3://${BUCKET}/${key}`;

  return key;
};

const saveDbAsMedia = async (
  url: string,
  key: string,
  size: string,
  meta: Record<string, string | number | null>,
  job: DownloadTask
) => {
  await prisma.media.create({
    data: {
      product: {
        connect: { id: job.productId },
      },
      url,
      size,
      meta,
      bucket: BUCKET,
      key,
    },
  });
};

const createRandomString = (length: number) => {
  const S = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let rnd = "";
  for (let i = 0; i < length; i++) {
    rnd += S.charAt(Math.floor(Math.random() * S.length));
  }
  return rnd;
};

const main = async () => {
  const task = await getTaskAndStart();
  if (!task) return;

  try {
    const fileNames = await Promise.race([
      download(task.id, task.targetUrl, DOWNLOAD_DIR, MIN_SIZE),
      timeout(DOWNLOAD_TIMEOUT),
      monitoringCancel(task.id),
    ]);

    for (let fileName of fileNames) {
      const { size, ...meta } = await scanMetaInfo(fileName);
      const key = await upload(
        fileName,
        `${task.product.code}-${createRandomString(16)}`
      );
      await saveDbAsMedia(
        `${process.env.R2_PUBLIC_URL}/${key}`,
        key,
        size,
        meta,
        task
      );
    }
    await complete(task.id);
  } catch (e) {
    if (e instanceof Error) await failedOrCanceled(task.id, e);
    throw e;
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
