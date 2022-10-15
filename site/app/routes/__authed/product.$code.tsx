import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { cacheHeaders } from "~/libs/cache/cache.server";
import { productFromFAN } from "~/libs/poduct/fan.server";
export { ProductPage as default } from "~/pages/ProductPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/product/:code"];
  const [mgs, fan] = await Promise.all([
    productFromMGS(code.trim()),
    productFromFAN(code.trim()),
  ]);
  const product = mgs ?? fan;
  if (!product) throw new Response("", { status: 404 });

  if (code !== product.code)
    return redirect(route("/product/:code", { code: product.code }), {
      status: 301,
      headers: cacheHeaders(),
    });

  return json(
    {
      product,
    },
    { headers: cacheHeaders() }
  );
};

export { headers } from "~/libs/cache/cache.server";
