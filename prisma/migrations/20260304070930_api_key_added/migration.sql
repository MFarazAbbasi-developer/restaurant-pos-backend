/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "apiKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_apiKey_key" ON "Restaurant"("apiKey");
