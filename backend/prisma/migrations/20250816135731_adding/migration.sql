/*
  Warnings:

  - You are about to alter the column `total_price` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `Add_To_Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `add_to_cart` DROP FOREIGN KEY `Add_To_Cart_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `add_to_cart` DROP FOREIGN KEY `Add_To_Cart_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_Item_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_Item_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_sub_catagory_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_stock` DROP FOREIGN KEY `Product_Stock_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_stock` DROP FOREIGN KEY `Product_Stock_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_categories` DROP FOREIGN KEY `Sub_Categories_main_catagoriy_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropIndex
DROP INDEX `Add_To_Cart_product_id_fkey` ON `add_to_cart`;

-- DropIndex
DROP INDEX `Add_To_Cart_user_id_fkey` ON `add_to_cart`;

-- DropIndex
DROP INDEX `Order_user_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `Order_Item_order_id_fkey` ON `order_item`;

-- DropIndex
DROP INDEX `Order_Item_product_id_fkey` ON `order_item`;

-- DropIndex
DROP INDEX `Product_sub_catagory_id_fkey` ON `product`;

-- DropIndex
DROP INDEX `Product_Stock_user_id_fkey` ON `product_stock`;

-- DropIndex
DROP INDEX `Sub_Categories_main_catagoriy_id_fkey` ON `sub_categories`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `order` MODIFY `total_price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `phone_no` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `house_no` VARCHAR(191) NOT NULL,
    `pin_no` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Add_To_Cart_user_id_product_id_key` ON `Add_To_Cart`(`user_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `User_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_Categories` ADD CONSTRAINT `Sub_Categories_main_catagoriy_id_fkey` FOREIGN KEY (`main_catagoriy_id`) REFERENCES `Main_Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sub_catagory_id_fkey` FOREIGN KEY (`sub_catagory_id`) REFERENCES `Sub_Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Add_To_Cart` ADD CONSTRAINT `Add_To_Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Add_To_Cart` ADD CONSTRAINT `Add_To_Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_Item` ADD CONSTRAINT `Order_Item_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_Item` ADD CONSTRAINT `Order_Item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Stock` ADD CONSTRAINT `Product_Stock_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Stock` ADD CONSTRAINT `Product_Stock_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
