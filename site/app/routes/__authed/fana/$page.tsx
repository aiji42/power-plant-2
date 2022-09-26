import { DataFunctionArgs } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
import { productsFromFANA } from "~/libs/products/fanA.server";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  const items = await productsFromFANA(Number(page));

  return {
    items,
    nextTo: route("/fana/:page", { page: `${Number(page) + 1}` }),
  };
};
