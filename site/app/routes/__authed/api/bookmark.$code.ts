import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import {
  getProductData,
  createProduct,
  deleteProduct,
  createDownloadTask,
} from "~/libs/prisma/product.server";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/bookmark/:code"];
  return json({
    bookmark: await getProductData(code),
  });
};

export const action = async ({ params, request }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/bookmark/:code"];
  if (request.method === "POST") {
    return json({
      bookmark: await createProduct(code),
    });
  }
  if (request.method === "DELETE") {
    return json({
      bookmark: await deleteProduct(code),
    });
  }
  if (request.method === "PATCH") {
    const url = (await request.formData()).get("url");
    if (typeof url !== "string") throw new Error("invalid data");
    await createDownloadTask(code, url);
  }

  return json({
    bookmark: await getProductData(code),
  });
};
