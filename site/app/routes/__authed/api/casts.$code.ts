import { DataFunctionArgs, HeadersFunction } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { searchCasts } from "~/libs/casts/casts";
import { formatter } from "~/libs/sku/sku";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/casts/:code"];
  const casts = await searchCasts(formatter(code)[0]);
  return {
    casts,
  };
};

export const headers: HeadersFunction = () => ({
  "Cache-Control": `max-age=0, s-maxage=${300}, stale-while-revalidate=${
    3600 * 24
  }`,
});
