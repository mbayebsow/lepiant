-- DropForeignKey
ALTER TABLE "Article_saved" DROP CONSTRAINT "Article_saved_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Article_saved" DROP CONSTRAINT "Article_saved_userId_fkey";

-- DropForeignKey
ALTER TABLE "Channel_subscribed" DROP CONSTRAINT "Channel_subscribed_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Channel_subscribed" DROP CONSTRAINT "Channel_subscribed_userId_fkey";

-- DropForeignKey
ALTER TABLE "Radio_liked" DROP CONSTRAINT "Radio_liked_radioId_fkey";

-- DropForeignKey
ALTER TABLE "Radio_liked" DROP CONSTRAINT "Radio_liked_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Session_sessionKey_key";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "lastActivity" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "createAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "expireAt" SET DATA TYPE TIMESTAMP(6);
