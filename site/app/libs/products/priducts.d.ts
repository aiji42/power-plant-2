import { TaskStatus } from "@prisma/client";

export type ProductList = {
  sku: string;
  image_path: string;
  name: string;
  casts: string[];
  downloadStatus?: TaskStatus;
  compressStatus?: TaskStatus;
  mediaSize?: string;
}[];
