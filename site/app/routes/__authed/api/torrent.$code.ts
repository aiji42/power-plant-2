import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { formatter } from "~/libs/sku/sku";
import { cacheHeaders } from "~/libs/cache/cache.server";
import { SearchedResult, searchLinks } from "~/libs/torrent/searchLinks";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/torrent/:code"];
  const items = (await Promise.all(formatter(code.trim()).map(searchLinks)))
    .flat()
    .reduce<SearchedResult[]>((res, item) => {
      return res.some(({ link }) => link === item.link) ? res : [...res, item];
    }, [])
    .sort(({ completed: a }, { completed: b }) =>
      Number(a) > Number(b) ? -1 : 1
    );
  return json(
    {
      items,
    },
    { headers: cacheHeaders({ swr: 3600 }) }
  );
};
