/*
  Warnings:

  - Added the required column `status` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "status" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "order_session" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "initiated_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL,

    CONSTRAINT "order_session_pkey" PRIMARY KEY ("id")
);
