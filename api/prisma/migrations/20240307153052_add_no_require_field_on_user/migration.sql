-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_defaultArticleCategorie_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'https://ik.imagekit.io/7whoa8vo6/lepiant/avatars/a388a057fd087204dd4b5cd90b79f54c-sticker%201__Npxb9iIU.png',
ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "language" SET DEFAULT 'fr',
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'sn',
ALTER COLUMN "isActive" DROP NOT NULL,
ALTER COLUMN "allowNotifications" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "defaultStartedPage" DROP NOT NULL,
ALTER COLUMN "defaultStartedPage" SET DEFAULT 'News',
ALTER COLUMN "defaultArticleCategorie" DROP NOT NULL,
ALTER COLUMN "defaultArticleCategorie" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultArticleCategorie_fkey" FOREIGN KEY ("defaultArticleCategorie") REFERENCES "Article_categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
