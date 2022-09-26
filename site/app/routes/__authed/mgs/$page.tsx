import { productsFromMSG } from "~/libs/products/mgs.server";
import { DataFunctionArgs } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  const items = await productsFromMSG(Number(page));

  return {
    items,
    nextTo: route("/mgs/:page", { page: `${Number(page) + 1}` }),
  };
};
