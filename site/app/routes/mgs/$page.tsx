import { productsFromMSG } from "~/libs/products/mgs.server";
import { DataFunctionArgs } from "@remix-run/node";
import { RouteParams } from "routes-gen";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  return await productsFromMSG(Number(page));
};
