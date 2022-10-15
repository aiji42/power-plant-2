import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import {
  getProductData,
  createProduct,
  deleteProduct,
  createDownloadTask,
  deleteMedia,
  connectCast,
  disconnectCast,
  createCompressTask,
  getCodeByRandom,
} from "~/libs/prisma/product.server";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/bookmark/:code"];
  const [bookmark, randomCode] = await Promise.all([
    getProductData(code),
    getCodeByRandom(),
  ]);
  return json({
    bookmark,
    randomCode: bookmark ? randomCode : "",
  });
};

export const action = async ({ params, request }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/bookmark/:code"];
  if (request.method === "POST") {
    await createProduct(code);
  }
  if (request.method === "DELETE") {
    await deleteProduct(code);
  }
  if (request.method === "PATCH") {
    const data = await request.formData();
    if (data.get("action") === "addDownloadTask") {
      const url = data.get("url");
      if (typeof url !== "string") throw new Error("invalid data");
      await createDownloadTask(code, url);
    }
    if (data.get("action") === "addCompressTask") {
      const mediaId = data.get("mediaId");
      if (typeof mediaId !== "string") throw new Error("invalid data");
      await createCompressTask(code, mediaId);
    }
    if (data.get("action") === "deleteMedia") {
      const id = data.get("id");
      if (typeof id !== "string") throw new Error("invalid data");
      await deleteMedia(id);
    }
    if (data.get("action") === "connectCast") {
      const name = data.get("name");
      if (typeof name !== "string") throw new Error("invalid data");
      await connectCast(code, name);
    }
    if (data.get("action") === "disconnectCast") {
      const name = data.get("name");
      if (typeof name !== "string") throw new Error("invalid data");
      await disconnectCast(code, name);
    }
  }

  return json({
    bookmark: await getProductData(code),
  });
};
