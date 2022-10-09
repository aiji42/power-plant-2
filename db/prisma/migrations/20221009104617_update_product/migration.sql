/*
  Warnings:

  - Added the required column `label` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "label" TEXT NOT NULL,
ALTER COLUMN "releasedAt" DROP NOT NULL;
