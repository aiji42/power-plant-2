import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { searchCasts } from "~/libs/casts/casts";
import { formatter } from "~/libs/sku/sku";
import { cacheHeaders } from "~/libs/cache/cache";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/casts/:code"];
  const casts = await searchCasts(formatter(code)[0]);
  return json(
    {
      casts,
    },
    { headers: cacheHeaders() }
  );
};
