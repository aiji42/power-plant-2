import { ProductList } from "~/libs/products/priducts";

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

export const productsFromMSG = async (page: number): Promise<ProductList> => {
  const [res1, res2] = await Promise.all([
    fetch(makeUrl(page * 2 - 1), {
      headers,
    }),
    fetch(makeUrl(page * 2), {
      headers,
    }),
  ]);
  const result = [
    ...((await res1.json()) as Result).search_result,
    ...((await res2.json()) as Result).search_result,
  ];
  return result.map((item) => ({
    sku: item.sku,
    name: item.name,
    image_path: `${process.env.MGS_IMAGE_HOST}${item.image_path}`,
  }));
};
