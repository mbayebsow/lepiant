/*
  Warnings:

  - Changed the type of `defaultStartedPage` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `defaultArticleCategorie` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Startpage" AS ENUM ('News', 'Radios');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultStartedPage",
ADD COLUMN     "defaultStartedPage" "Startpage" NOT NULL,
DROP COLUMN "defaultArticleCategorie",
ADD COLUMN     "defaultArticleCategorie" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultArticleCategorie_fkey" FOREIGN KEY ("defaultArticleCategorie") REFERENCES "Article_categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
