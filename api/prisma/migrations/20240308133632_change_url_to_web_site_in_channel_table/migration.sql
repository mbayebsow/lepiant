/*
  Warnings:

  - You are about to drop the column `url` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `webSite` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "isActive" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "url",
ADD COLUMN     "webSite" TEXT NOT NULL;
