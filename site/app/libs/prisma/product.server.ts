import { prisma } from "~/libs/prisma/client.server";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { productFromFAN } from "~/libs/poduct/fan.server";

export const isExisting = async (code: string) => {
  return !!(await prisma.product.findUnique({ where: { code } }));
};

export const createOrDelete = async (code: string) => {
  if (await isExisting(code)) {
    await prisma.product.delete({ where: { code } });
    return null;
  }

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
