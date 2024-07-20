/*
  Warnings:

  - A unique constraint covering the columns `[images]` on the table `Quotidien` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quotidien" ALTER COLUMN "publishedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Revue" ALTER COLUMN "publishedAt" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Quotidien_images_key" ON "Quotidien"("images");
