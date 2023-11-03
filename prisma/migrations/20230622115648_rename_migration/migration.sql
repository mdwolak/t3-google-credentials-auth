/*
 Warnings:
 - You are about to drop the column `x_category` on the `Exemplar` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[title]` on the table `Exemplar` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `category` to the `Exemplar` table without a default value. This is not possible if the table is not empty.
 */

-- DropIndex

DROP INDEX "Exemplar_content_x_category_key";

-- AlterTable

ALTER TABLE "Exemplar" RENAME COLUMN "x_category" TO "category";

-- CreateIndex

CREATE UNIQUE INDEX "Exemplar_title_key" ON "Exemplar"("title");