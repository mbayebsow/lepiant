/*
  Warnings:

  - A unique constraint covering the columns `[sessionKey]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "sessionKey" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionKey_key" ON "Session"("sessionKey");
