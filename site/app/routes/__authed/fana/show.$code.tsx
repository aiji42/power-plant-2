import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productFromFAN } from "~/libs/poduct/fan.server";
import { cacheHeaders } from "~/libs/cache/cache.server";
export { Product as default } from "~/pages/Product";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/fana/show/:code"];
  const product = await productFromFAN(code);
  if (!product) throw new Response("", { status: 404 });

  return json(
    {
      product,
    },
    { headers: cacheHeaders() }
  );
};

export { headers } from "~/libs/cache/cache.server";
