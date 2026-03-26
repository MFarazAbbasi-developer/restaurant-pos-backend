/*
  Warnings:

  - Changed the type of `externalId` on the `OrderDeal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `externalId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OrderDeal" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER NOT NULL;
