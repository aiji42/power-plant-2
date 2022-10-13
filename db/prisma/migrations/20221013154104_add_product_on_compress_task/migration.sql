/*
  Warnings:

  - Added the required column `productId` to the `CompressTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompressTask" ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CompressTask" ADD CONSTRAINT "CompressTask_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
