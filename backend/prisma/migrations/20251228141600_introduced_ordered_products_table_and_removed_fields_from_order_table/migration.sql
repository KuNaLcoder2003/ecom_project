/*
  Warnings:

  - You are about to drop the column `price` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "price",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "ordered_products" (
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "qunatity" INTEGER NOT NULL,

    CONSTRAINT "ordered_products_pkey" PRIMARY KEY ("product_id","order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ordered_products_order_id_key" ON "ordered_products"("order_id");

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
