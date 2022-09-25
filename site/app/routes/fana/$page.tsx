import { DataFunctionArgs } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productsFromFANA } from "~/libs/products/fanA.server";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  return await productsFromFANA(Number(page));
};
