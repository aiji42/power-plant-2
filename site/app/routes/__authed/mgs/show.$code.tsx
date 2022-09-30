import { DataFunctionArgs } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { productFromMGS } from "~/libs/poduct/mgs.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/mgs/show/:code"];
  const product = await productFromMGS(code);

  return {
    product,
  };
};

export default () => {
  const data = useLoaderData<typeof loader>();
  return <>{JSON.stringify(data)}</>;
};
