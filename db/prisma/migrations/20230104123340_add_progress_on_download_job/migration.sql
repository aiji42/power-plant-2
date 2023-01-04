-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'Canceled';

-- AlterTable
ALTER TABLE "DownloadTask" ADD COLUMN     "progress" JSONB;
