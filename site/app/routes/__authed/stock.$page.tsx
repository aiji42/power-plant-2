import { DataFunctionArgs, json } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
import { productsFromDB } from "~/libs/products/db.server";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/stock/:page"];
  const items = await productsFromDB(Number(page));

  return json({
    items,
    nextTo: route("/stock/:page", { page: `${Number(page) + 1}` }),
  });
};
