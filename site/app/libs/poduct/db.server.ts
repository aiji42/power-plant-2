import { Product } from "~/libs/poduct/product";
import { getProductData } from "~/libs/prisma/product.server";

export const productFromDb = async (code: string): Promise<Product | null> => {
  const product = await getProductData(code);
  if (!product) return null;
  return {
    imageUrls: product.imageUrls,
    title: product.title,
    code: product.code,
    releasedAt: product.releasedAt?.toISOString().slice(0, 10),
    series: product.series,
    maker: product.maker,
    label: product.label,
    genres: product.genres,
    url: product.url,
  };
};
