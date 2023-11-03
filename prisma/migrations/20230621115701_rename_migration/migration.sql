/*
 Warnings:
 - You are about to drop the column `category` on the `Exemplar` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[content,x_category]` on the table `Exemplar` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `x_category` to the `Exemplar` table without a default value. This is not possible if the table is not empty.
 */

-- DropIndex

DROP INDEX "Exemplar_title_key";

-- AlterTable

ALTER TABLE "Exemplar" RENAME COLUMN "category" TO "x_category";

-- CreateIndex

CREATE UNIQUE INDEX "Exemplar_content_x_category_key" ON "Exemplar"("content", "x_category");