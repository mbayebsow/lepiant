-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "language" SET DEFAULT 'fr';

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'fr';

-- CreateTable
CREATE TABLE "Liked_radio" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "radioId" INTEGER NOT NULL,

    CONSTRAINT "Liked_radio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Liked_radio" ADD CONSTRAINT "Liked_radio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liked_radio" ADD CONSTRAINT "Liked_radio_radioId_fkey" FOREIGN KEY ("radioId") REFERENCES "Radio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
