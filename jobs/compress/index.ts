import { $, fs, path } from "zx";
import ffprobe from "ffprobe";
import {
  PrismaClient,
  TaskStatus,
  CompressTask,
  Product,
  Media,
} from "@prisma/client";

const prisma = new PrismaClient({ log: ["info", "warn", "error"] });

const DOWNLOAD_DIR = "/downloads";
const BUCKET = "power-plant-2";

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

const getTaskAndStart = async (): Promise<
  CompressTask & { media: Media; product: Product }
> => {
  const task = await prisma.compressTask.findFirst({
    where: { status: TaskStatus.Waiting, NOT: { media: null } },
  });
  if (!task) return null;

  return prisma.compressTask.update({
    where: { id: task.id },
    data: {
      status: TaskStatus.Running,
      startedAt: new Date(),
      stoppedAt: null,
    },
    include: {
      product: true,
      media: true,
    },
  });
};

const complete = (job: Pick<CompressTask, "id" | "mediaId">) => {
  return prisma.$transaction([
    prisma.compressTask.update({
      where: { id: job.id },
      data: { status: TaskStatus.Completed, stoppedAt: new Date() },
    }),
    prisma.media.delete({
      where: { id: job.mediaId },
    }),
  ]);
};

const failed = (job: Pick<CompressTask, "id">, e: Error) => {
  return prisma.compressTask.update({
    where: { id: job.id },
    data: {
      status: TaskStatus.Failed,
      stoppedAt: new Date(),
      message: e.message,
    },
  });
};

const download = async (url: string, dir: string): Promise<string> => {
  const outName = `${dir}/video.mp4`;
  await $`ffmpeg -i ${url} -c copy ${outName}`;

  return outName;
};

const compress = async (file: string) => {
  const outFile = `${path.dirname(file)}/${path.basename(
    file,
    path.extname(file)
  )}-compressed.mp4`;
  await $`ffmpeg -y -i ${file} -s 856:480 -b:v 1.2m -r 30 -vcodec libx264 ${outFile}`;

  return outFile;
};

const convertToHLS = async (file: string, prefix: string): Promise<string> => {
  await $`mkdir ${prefix}`;

  const movedFile = `${prefix}/video${path.extname(file)}}`;
  await $`mv ${file} ${movedFile}`;

  await $`ffmpeg -y -i ${movedFile} -s 856:480 -b:v 1.2m -r 30 -vcodec libx264 -f hls -hls_time 30 -hls_playlist_type vod -hls_segment_filename "${prefix}/video%4d.ts" ${prefix}/video.m3u8`;

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
  job: CompressTask
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
    const fileName = await download(task.media.url, DOWNLOAD_DIR);
    const compressedFileName = await compress(fileName);
    const { size, ...meta } = await scanMetaInfo(compressedFileName);
    const dir = `${task.product.code}-${createRandomString(16)}`;
    const key = await convertToHLS(compressedFileName, dir);
    await uploadToStorage(dir);
    await saveDbAsMedia(
      `${process.env.R2_PUBLIC_URL}/${key}`,
      key,
      size,
      meta,
      task
    );

    await complete(task);
  } catch (e) {
    await failed(task, e);
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
