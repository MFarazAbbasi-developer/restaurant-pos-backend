/*
  Warnings:

  - Made the column `externalId` on table `OrderDeal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderDeal" ALTER COLUMN "externalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "externalId" SET NOT NULL;
