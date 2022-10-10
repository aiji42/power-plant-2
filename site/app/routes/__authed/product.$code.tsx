import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { cacheHeaders } from "~/libs/cache/cache.server";
import { productFromFAN } from "~/libs/poduct/fan.server";
export { Product as default } from "~/pages/Product";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/product/:code"];
  const [mgs, fan] = await Promise.all([
    productFromMGS(code),
    productFromFAN(code),
  ]);
  const product = mgs ?? fan;
  if (!product) throw new Response("", { status: 404 });

  return json(
    {
      product,
    },
    { headers: cacheHeaders() }
  );
};

export { headers } from "~/libs/cache/cache.server";
