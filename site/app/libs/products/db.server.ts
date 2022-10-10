import { ProductList } from "~/libs/products/priducts";
import { prisma } from "~/libs/prisma/client.server";

const makeUrl = (page: number) => {
  const url = new URL(`${process.env.MGS_HOST}/api/n/search/index.php`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", "new");
  return url;
};

const headers = {
  "User-Agent": process.env.MGS_UA!,
  "Content-Type": "application/json",
};

type Result = {
  search_result: { sku: string; name: string; image_path: string }[];
};

const SIZE = 100;

export const productsFromDB = async (page: number): Promise<ProductList> => {
  const res = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: SIZE,
    skip: SIZE * (page - 1),
    select: {
      code: true,
      title: true,
      imageUrls: true,
      casts: {
        select: {
          name: true,
        },
      },
    },
  });

  return res.map((p) => ({
    sku: p.code,
    name: p.title,
    image_path: p.imageUrls[0] ?? "",
    casts: p.casts.map(({ name }) => name),
  }));
};
