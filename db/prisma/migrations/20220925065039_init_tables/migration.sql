-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Waiting', 'Running', 'Completed', 'Failed');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "genres" TEXT[],
    "url" TEXT NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL,
    "imageUrls" TEXT[],

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cast" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadTask" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "stoppedAt" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'Waiting',
    "message" TEXT,
    "targetUrl" TEXT NOT NULL,

    CONSTRAINT "DownloadTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompressTask" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "stoppedAt" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'Waiting',
    "message" TEXT,

    CONSTRAINT "CompressTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CastToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Product_title_idx" ON "Product"("title");

-- CreateIndex
CREATE INDEX "Product_maker_idx" ON "Product"("maker");

-- CreateIndex
CREATE INDEX "Product_series_idx" ON "Product"("series");

-- CreateIndex
CREATE INDEX "Media_size_idx" ON "Media"("size");

-- CreateIndex
CREATE UNIQUE INDEX "Cast_name_key" ON "Cast"("name");

-- CreateIndex
CREATE INDEX "Cast_name_idx" ON "Cast"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CastToProduct_AB_unique" ON "_CastToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CastToProduct_B_index" ON "_CastToProduct"("B");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadTask" ADD CONSTRAINT "DownloadTask_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompressTask" ADD CONSTRAINT "CompressTask_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CastToProduct" ADD CONSTRAINT "_CastToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Cast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CastToProduct" ADD CONSTRAINT "_CastToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
