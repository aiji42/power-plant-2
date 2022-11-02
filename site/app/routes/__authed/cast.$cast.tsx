import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { cacheHeaders } from "~/libs/cache/cache.server";
import { searchCastUrls, searchFromFan } from "~/libs/casts/casts";
import { productsFromDB } from "~/libs/products/db.server";
import { makeSearchUrl } from "~/libs/torrent/searchLinks";
export { CastPage as default } from "~/pages/CastPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { cast } = params as RouteParams["/cast/:cast"];
  const items = await productsFromDB(1, { cast, size: 999 });
  const castData = await searchFromFan(cast);
  const links = searchCastUrls(cast);

  return json(
    {
      items,
      cast: castData,
      links: [...links, makeSearchUrl(cast).toString()],
    },
    { headers: cacheHeaders({ swr: 3600 }) }
  );
};

export { headers } from "~/libs/cache/cache.server";
