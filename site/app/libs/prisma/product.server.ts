import { prisma } from "~/libs/prisma/client.server";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { productFromFAN } from "~/libs/poduct/fan.server";
import { TaskStatus } from "@prisma/client";

export const getProductData = async (code: string) => {
  return prisma.product.findUnique({
    where: { code },
    include: {
      casts: { select: { name: true, _count: { select: { products: true } } } },
      downloadTasks: { orderBy: { createdAt: "desc" } },
      compressTasks: { orderBy: { createdAt: "desc" } },
      medias: true,
    },
  });
};

export const createProduct = async (code: string) => {
  const [mgs, fan] = await Promise.all([
    productFromMGS(code),
    productFromFAN(code),
  ]);
  const data = mgs ?? fan;
  if (!data) throw new Error();

  return await prisma.product.create({
    data: {
      code,
      title: data.title,
      imageUrls: data.imageUrls,
      releasedAt: data.releasedAt ? new Date(data.releasedAt) : null,
      genres: data.genres,
      maker: data.maker ?? "",
      label: data.label ?? "",
      series: data.series ?? "",
      url: data.url,
    },
  });
};

export const deleteProduct = async (code: string) => {
  await prisma.product.delete({ where: { code } });
  return null;
};

export const createDownloadTask = async (code: string, url: string) => {
  await prisma.product.update({
    where: { code },
    data: {
      downloadTasks: {
        create: {
          targetUrl: url,
        },
      },
    },
  });
};

export const cancelDownloadTask = async (id: string) => {
  await prisma.downloadTask.update({
    where: { id },
    data: {
      status: TaskStatus.Canceled,
    },
  });
};

export const createCompressTask = async (code: string, mediaId: string) => {
  await prisma.product.update({
    where: { code },
    data: {
      compressTasks: {
        create: {
          mediaId,
        },
      },
    },
  });
};

export const addMedia = async (
  code: string,
  { name, size }: { name: string; size: string }
) => {
  const key = `${code}/${name}`;
  await prisma.product.update({
    where: { code },
    data: {
      medias: {
        create: {
          url: `${process.env.R2_PUBLIC_URL}/${key}`,
          size,
          key,
          meta: {},
          bucket: process.env.BUCKET_NAME!,
        },
      },
    },
  });
};

export const deleteMedia = async (id: string) => {
  await prisma.media.delete({ where: { id } });
};

export const connectCast = async (code: string, name: string) => {
  await prisma.product.update({
    where: { code },
    data: {
      casts: {
        connectOrCreate: {
          where: { name },
          create: { name },
        },
      },
    },
  });
};

export const disconnectCast = async (code: string, name: string) => {
  await prisma.product.update({
    where: { code },
    data: {
      casts: {
        disconnect: {
          name,
        },
      },
    },
  });
};

export const countByCast = async (name: string) => {
  return prisma.product.count({
    where: { casts: { some: { name } } },
  });
};

export const getCodeByRandom = async () => {
  const count = await prisma.media.count();
  const skip = Math.floor(Math.random() * count);
  const {
    product: { code },
  } = await prisma.media.findFirstOrThrow({
    skip,
    select: {
      product: {
        select: { code: true },
      },
    },
  });

  return code;
};
