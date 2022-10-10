import { prisma } from "~/libs/prisma/client.server";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { productFromFAN } from "~/libs/poduct/fan.server";

export const getProductData = async (code: string) => {
  return await prisma.product.findUnique({
    where: { code },
    include: {
      casts: { select: { name: true, _count: { select: { products: true } } } },
      downloadTasks: { orderBy: { createdAt: "desc" } },
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
