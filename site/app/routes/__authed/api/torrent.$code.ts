import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { formatter } from "~/libs/sku/sku";
import { cacheHeaders } from "~/libs/cache/cache.server";
import { searchLinks } from "~/libs/torrent/searchLinks";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/torrent/:code"];
  const items = (
    await Promise.all(formatter(code).map((c) => searchLinks(c)))
  ).flat();
  return json(
    {
      items,
    },
    { headers: cacheHeaders({ swr: 3600 }) }
  );
};
