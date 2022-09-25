import { ProductList } from "~/libs/products/priducts";
import { productsSearchFromFAN } from "~/libs/products/fan.server";

const SIZE = 100;

export const productsFromFANA = async (
  page: number,
  sort = "date",
  keyword?: string | null
): Promise<ProductList> => {
  const res = await productsSearchFromFAN({
    offset: String((page - 1) * SIZE + 1),
    floor: "videoa",
    hits: SIZE,
    sort,
    lte_date: new Date().toISOString().slice(0, 19),
    keyword,
  });
  return (
    res.items
      .filter(({ iteminfo: { genre } }) =>
        genre?.every(
          ({ id }) =>
            ![3036, 6793, 4060, 35, 6996, 1014, 1032, 4002].includes(id)
        )
      )
      .map(({ title, content_id, imageURL, iteminfo }) => ({
        name: title,
        sku: content_id,
        image_path: imageURL.large,
      })) ?? []
  );
};
