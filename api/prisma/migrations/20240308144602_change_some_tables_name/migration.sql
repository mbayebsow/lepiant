/*
  Warnings:

  - You are about to drop the `Liked_radio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscribed_channel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Liked_radio" DROP CONSTRAINT "Liked_radio_radioId_fkey";

-- DropForeignKey
ALTER TABLE "Liked_radio" DROP CONSTRAINT "Liked_radio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscribed_channel" DROP CONSTRAINT "Subscribed_channel_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Subscribed_channel" DROP CONSTRAINT "Subscribed_channel_userId_fkey";

-- DropTable
DROP TABLE "Liked_radio";

-- DropTable
DROP TABLE "Subscribed_channel";

-- CreateTable
CREATE TABLE "Channel_subscribed" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Channel_subscribed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Radio_liked" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "radioId" INTEGER NOT NULL,

    CONSTRAINT "Radio_liked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel_subscribed" ADD CONSTRAINT "Channel_subscribed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_subscribed" ADD CONSTRAINT "Channel_subscribed_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Radio_liked" ADD CONSTRAINT "Radio_liked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Radio_liked" ADD CONSTRAINT "Radio_liked_radioId_fkey" FOREIGN KEY ("radioId") REFERENCES "Radio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
