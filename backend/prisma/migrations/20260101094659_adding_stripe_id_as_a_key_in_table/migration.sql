/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ordered_products_order_id_key";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "stripe_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_id_key" ON "payments"("stripe_id");
