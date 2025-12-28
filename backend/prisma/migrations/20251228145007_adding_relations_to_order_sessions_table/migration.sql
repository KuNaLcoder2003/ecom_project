/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `order_session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_session_order_id_key" ON "order_session"("order_id");

-- AddForeignKey
ALTER TABLE "order_session" ADD CONSTRAINT "order_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_session" ADD CONSTRAINT "order_session_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
