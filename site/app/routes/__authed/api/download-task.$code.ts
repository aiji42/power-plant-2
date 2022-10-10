import { DataFunctionArgs, json } from "@remix-run/node";
import { RouteParams } from "routes-gen";
import {
  createDownloadTask,
  getDownloadTasks,
} from "~/libs/prisma/product.server";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/download-task/:code"];
  const tasks = await getDownloadTasks(code);
  return json({
    tasks,
    status: tasks[0]?.status ?? null,
  });
};

export const action = async ({ params, request }: DataFunctionArgs) => {
  const { code } = params as RouteParams["/api/download-task/:code"];
  const url = (await request.formData()).get("url");
  if (typeof url !== "string") throw new Error("invalid data");
  await createDownloadTask(code, url);

  const tasks = await getDownloadTasks(code);
  return json({
    tasks,
    status: tasks[0]?.status ?? null,
  });
};
