import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import { createOrDelete, isExisting } from "~/libs/prisma/product.server";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/bookmark/:code"];
  return json({
    isBookmarked: await isExisting(code),
  });
};

export const action = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/bookmark/:code"];
  const res = await createOrDelete(code);

  return json({
    isBookmarked: !!res,
  });
};
