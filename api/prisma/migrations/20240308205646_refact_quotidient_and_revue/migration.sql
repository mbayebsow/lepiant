/*
  Warnings:

  - You are about to drop the `Quotidien_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Revue_audio` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Revue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `images` to the `Quotidien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedAt` to the `Quotidien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio` to the `Revue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Revue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedAt` to the `Revue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quotidien_image" DROP CONSTRAINT "Quotidien_image_quotidienId_fkey";

-- DropForeignKey
ALTER TABLE "Revue_audio" DROP CONSTRAINT "Revue_audio_revueId_fkey";

-- AlterTable
ALTER TABLE "Quotidien" ADD COLUMN     "images" TEXT NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Revue" ADD COLUMN     "audio" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Quotidien_image";

-- DropTable
DROP TABLE "Revue_audio";

-- CreateIndex
CREATE UNIQUE INDEX "Revue_name_key" ON "Revue"("name");
