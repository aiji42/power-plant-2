export type ProductListItem = {
  sku: string;
  image_path: string;
  name: string;
};

export const productsFromMSG = async (
  page: number,
  sort?: string,
  keyword?: string | null
): Promise<ProductListItem[]> => {
  const url = new URL(`${process.env.MGS_HOST}/api/n/search/index.php`);
  url.searchParams.append("page", String(page));
  url.searchParams.append("sort", sort ?? "new");
  keyword && url.searchParams.append("search_word", keyword);

  const res = await fetch(url, {
    headers: {
      "User-Agent": process.env.MGS_UA ?? "",
      "Content-Type": "application/json",
    },
  });
  const result: { search_result: ProductListItem[] } = await res.json();
  return result.search_result.map((item) => ({
    sku: item.sku,
    name: item.name,
    image_path: `${process.env.MGS_IMAGE_HOST}${item.image_path}`,
  }));
};
