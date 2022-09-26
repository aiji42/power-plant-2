import { DataFunctionArgs } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
import { productsFromFANC } from "~/libs/products/fanC.server";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  const items = await productsFromFANC(Number(page));

  return {
    items,
    nextTo: route("/fanc/:page", { page: `${Number(page) + 1}` }),
  };
};
