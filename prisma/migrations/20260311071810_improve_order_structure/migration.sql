/*
  Warnings:

  - Added the required column `name` to the `OrderDeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "acceptedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderDeal" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Order_restaurantId_idx" ON "Order"("restaurantId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderDeal_orderId_idx" ON "OrderDeal"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
