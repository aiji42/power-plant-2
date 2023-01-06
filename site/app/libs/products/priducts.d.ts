import { TaskStatus } from "@prisma/client";

export type ProductList = {
  sku: string;
  image_path: string;
  name: string;
  casts: string[];
  status?: TaskStatus;
  mediaSize?: string;
}[];
