import { DataFunctionArgs } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productFromMGS } from "~/libs/poduct/mgs.server";
export { Product as default } from "~/pages/Product";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/mgs/show/:code"];
  const product = await productFromMGS(code);
  if (!product) throw new Response("", { status: 404 });

  return {
    product,
  };
};
