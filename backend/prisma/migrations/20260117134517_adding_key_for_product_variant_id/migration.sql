/*
  Warnings:

  - A unique constraint covering the columns `[product_variant_id]` on the table `cart_products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_variant_id` to the `cart_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_products" ADD COLUMN     "product_variant_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_products_product_variant_id_key" ON "cart_products"("product_variant_id");

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
