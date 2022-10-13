import { $, fs, path } from "zx";
import ffprobe from "ffprobe";
import { PrismaClient, TaskStatus, DownloadTask } from "@prisma/client";

const prisma = new PrismaClient({ log: ["info", "warn", "error"] });

const MIN_SIZE = 200 * 1024 * 1024; // 200M
const DOWNLOAD_TIMEOUT = 30 * 60 * 1000; // 30min
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

  return await prisma.downloadTask.update({
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

const failed = (id: string, e: Error) => {
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

const download = async (
  url: string,
  dir: string,
  minSize: number
): Promise<string[]> => {
  await $`aria2c -d ${dir} --seed-time=0 --max-overall-upload-limit=1K --bt-stop-timeout=300 --lowest-speed-limit=500K ${url}`;

  return listFiles(dir).filter(
    (filePath) => fs.statSync(filePath).size > minSize
  );
};

const convertToHLS = async (file: string, prefix: string): Promise<string> => {
  await $`mkdir ${prefix}`;

  const movedFile = `${prefix}/video${path.extname(file)}}`;
  await $`mv ${file} ${movedFile}`;

  await $`ffmpeg -i ${movedFile} -c:v copy -c:a copy -f hls -hls_time 30 -hls_playlist_type vod -hls_segment_filename "${prefix}/video%4d.ts" ${prefix}/video.m3u8`;

  await $`rm -f ${movedFile}`;

  return `${prefix}/video.m3u8`;
};

const uploadToStorage = async (prefix: string) => {
  // https://developers.cloudflare.com/r2/data-access/s3-api/api/#implemented-object-level-operations
  await $`aws configure set default.s3.max_concurrent_requests 2`;
  await $`aws s3 sync --endpoint-url https://${process.env.R2_CLIENT_ID}.r2.cloudflarestorage.com ${prefix} s3://${BUCKET}/${prefix}`;
};

const saveDbAsMedia = async (
  url: string,
  key: string,
  size: string,
  meta: Record<string, string | number>,
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
      download(task.targetUrl, DOWNLOAD_DIR, MIN_SIZE),
      timeout(DOWNLOAD_TIMEOUT),
    ]);

    for (let orgFile of fileNames) {
      const { size, ...meta } = await scanMetaInfo(orgFile);
      const dir = `${task.product.code}-${createRandomString(16)}`;
      const key = await convertToHLS(orgFile, dir);
      await uploadToStorage(dir);
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
    await failed(task.id, e);
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
