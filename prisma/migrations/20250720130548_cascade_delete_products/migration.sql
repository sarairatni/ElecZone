/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_CategoryID_fkey`;

-- DropIndex
DROP INDEX `Product_CategoryID_fkey` ON `product`;

-- CreateIndex
CREATE UNIQUE INDEX `Category_Name_key` ON `Category`(`Name`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `Category`(`CategoryID`) ON DELETE CASCADE ON UPDATE CASCADE;
