import { productsFromMSG } from "~/libs/products/mgs.server";
import { DataFunctionArgs, json } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
import { cacheHeaders } from "~/libs/cache/cache";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  const items = await productsFromMSG(Number(page));

  return json(
    {
      items,
      nextTo: route("/mgs/:page", { page: `${Number(page) + 1}` }),
    },
    { headers: cacheHeaders({ swr: 3600 }) }
  );
};

export { headers } from "~/libs/cache/cache";
