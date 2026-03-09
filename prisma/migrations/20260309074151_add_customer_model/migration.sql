/*
  Warnings:

  - The values [OFFLINE_CUSTOMER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `name` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ONLINE_CUSTOMER', 'ADMIN', 'STAFF');
ALTER TABLE "public"."Customer" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Customer" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "Customer" ALTER COLUMN "role" SET DEFAULT 'ONLINE_CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "country" VARCHAR(50) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" VARCHAR(20) NOT NULL,
ADD COLUMN     "state" VARCHAR(100) NOT NULL,
ADD COLUMN     "street" VARCHAR(150) NOT NULL,
ADD COLUMN     "zipCode" VARCHAR(20) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "Address";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
