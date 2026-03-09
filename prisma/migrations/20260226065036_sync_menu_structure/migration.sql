/*
  Warnings:

  - You are about to alter the column `price` on the `MenuItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[externalId,restaurantId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId,restaurantId]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showInOrders` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPrice` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "defaultStationId" TEXT,
ADD COLUMN     "externalId" INTEGER NOT NULL,
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "showInOrders" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "costPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "externalId" INTEGER NOT NULL,
ADD COLUMN     "foodPandaPrice" DECIMAL(10,2),
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "restaurantId" TEXT NOT NULL,
ADD COLUMN     "stationId" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "weight" DECIMAL(10,3),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "isAvailable" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PrintStation" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "name" TEXT,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "PrintStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "costPrice" DECIMAL(10,2) NOT NULL,
    "foodPandaPrice" DECIMAL(10,2),
    "isAvailable" BOOLEAN NOT NULL,
    "imageUrl" TEXT,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dealId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,

    CONSTRAINT "DealItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrintStation_externalId_restaurantId_key" ON "PrintStation"("externalId", "restaurantId");

-- CreateIndex
CREATE INDEX "Deal_restaurantId_idx" ON "Deal"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_externalId_restaurantId_key" ON "Deal"("externalId", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "DealItem_dealId_menuItemId_key" ON "DealItem"("dealId", "menuItemId");

-- CreateIndex
CREATE INDEX "Category_restaurantId_idx" ON "Category"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_externalId_restaurantId_key" ON "Category"("externalId", "restaurantId");

-- CreateIndex
CREATE INDEX "MenuItem_restaurantId_idx" ON "MenuItem"("restaurantId");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_idx" ON "MenuItem"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_externalId_restaurantId_key" ON "MenuItem"("externalId", "restaurantId");

-- AddForeignKey
ALTER TABLE "PrintStation" ADD CONSTRAINT "PrintStation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_defaultStationId_fkey" FOREIGN KEY ("defaultStationId") REFERENCES "PrintStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PrintStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealItem" ADD CONSTRAINT "DealItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealItem" ADD CONSTRAINT "DealItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
