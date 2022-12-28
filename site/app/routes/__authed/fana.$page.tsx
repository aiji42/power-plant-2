import { DataFunctionArgs, json } from "@remix-run/node";
import { route, RouteParams } from "routes-gen";
import { productsFromFANA } from "~/libs/products/fanA.server";
import { cacheHeaders } from "~/libs/cache/cache";
export { ListPage as default } from "~/pages/ListPage";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { page } = params as RouteParams["/mgs/:page"];
  const items = await productsFromFANA(Number(page));

  return json(
    {
      items,
      nextTo: route("/fana/:page", { page: `${Number(page) + 1}` }),
    },
    { headers: cacheHeaders({ swr: 3600 }) }
  );
};

export { headers } from "~/libs/cache/cache";
