-- DropForeignKey
ALTER TABLE "CompressTask" DROP CONSTRAINT "CompressTask_mediaId_fkey";

-- AlterTable
ALTER TABLE "CompressTask" ALTER COLUMN "mediaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CompressTask" ADD CONSTRAINT "CompressTask_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
