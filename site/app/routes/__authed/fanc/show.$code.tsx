import { DataFunctionArgs, HeadersFunction } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productFromFAN } from "~/libs/poduct/fan.server";
export { Product as default } from "~/pages/Product";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/fana/show/:code"];
  const product = await productFromFAN(code);
  if (!product) throw new Response("", { status: 404 });

  return {
    product,
  };
};

export const headers: HeadersFunction = () => ({
  "Cache-Control": `max-age=0, s-maxage=${300}, stale-while-revalidate=${
    3600 * 24
  }`,
});
