import { ProductList } from "~/libs/products/priducts";

export const productsFromMSG = async (
  page: number,
  sort?: string,
  keyword?: string | null
): Promise<ProductList> => {
  const url = new URL(`${process.env.MGS_HOST}/api/n/search/index.php`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", sort ?? "new");
  keyword && url.searchParams.set("search_word", keyword);

  const res = await fetch(url, {
    headers: {
      "User-Agent": process.env.MGS_UA ?? "",
      "Content-Type": "application/json",
    },
  });
  const result: {
    search_result: { sku: string; name: string; image_path: string }[];
  } = await res.json();
  return result.search_result.map((item) => ({
    sku: item.sku,
    name: item.name,
    image_path: `${process.env.MGS_IMAGE_HOST}${item.image_path}`,
  }));
};
