import { prisma } from "~/libs/prisma/client.server";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { productFromFAN } from "~/libs/poduct/fan.server";

export const getProductData = async (code: string) => {
  return await prisma.product.findUnique({
    where: { code },
    include: {
      casts: true,
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
    include: {
      casts: true,
      downloadTasks: { orderBy: { createdAt: "desc" } },
      medias: true,
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

export const getDownloadTasks = (code: string) => {
  return prisma.downloadTask.findMany({
    where: { product: { code } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
};
