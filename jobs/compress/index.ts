import { $, fs } from "zx";
import ffprobe from "ffprobe";
import {
  PrismaClient,
  TaskStatus,
  CompressTask,
  Product,
  Media,
} from "@prisma/client";

const prisma = new PrismaClient({ log: ["info", "warn", "error"] });

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

const download = async (url: string): Promise<string> => {
  const out = "_video.mp4";
  await $`ffmpeg -i ${url} -bsf:a aac_adtstoasc -c copy ${out}`;

  return out;
};

const compress = async (file: string) => {
  const out = "video.mp4";
  // compress to 360p
  await $`ffmpeg -i ${file} -vf scale=-1:360 -r 24 -movflags +faststart -c:v libx264 -profile:v high -level:v 4.0 -b_strategy 2 -bf 2 -flags cgop -coder ac -pix_fmt yuv420p -crf 23 -maxrate 1M -bufsize 2M -c:a aac -ac 2 -ar 48000 -b:a 384k ${out}`;

  return out;
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
    const fileName = await compress(await download(task.media.url));
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
