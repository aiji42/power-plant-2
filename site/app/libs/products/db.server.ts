import { ProductList } from "~/libs/products/priducts";
import { prisma } from "~/libs/prisma/client.server";

const SIZE = 100;

export const productsFromDB = async (
  page: number,
  option?: { cast?: string; size?: number }
): Promise<ProductList> => {
  const size = option?.size ?? SIZE;

  const res = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    ...(option?.cast
      ? {
          where: {
            casts: {
              some: {
                name: option.cast,
              },
            },
          },
        }
      : {}),
    take: size,
    skip: size * (page - 1),
    select: {
      code: true,
      title: true,
      imageUrls: true,
      casts: {
        select: {
          name: true,
        },
      },
      downloadTasks: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { status: true },
      },
      compressTasks: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { status: true },
      },
      medias: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { size: true },
      },
    },
  });

  return res.map((p) => ({
    sku: p.code,
    name: p.title,
    image_path: p.imageUrls.slice(-1)[0] ?? "",
    casts: p.casts.map(({ name }) => name),
    downloadStatus: p.downloadTasks[0]?.status,
    compressStatus: p.compressTasks[0]?.status,
    mediaSize: p.medias[0]?.size,
  }));
};
