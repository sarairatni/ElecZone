/*
  Warnings:

  - You are about to drop the column `customerAddress` on the `Order` table. All the data in the column will be lost.
  - Added the required column `commune` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailedAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wilaya` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerAddress",
ADD COLUMN     "commune" TEXT NOT NULL,
ADD COLUMN     "detailedAddress" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "wilaya" TEXT NOT NULL;
