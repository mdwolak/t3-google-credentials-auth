/*
  Warnings:

  - You are about to drop the column `title` on the `Exemplar` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Exemplar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Exemplar` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Exemplar_title_key";

-- AlterTable
ALTER TABLE "Exemplar" RENAME COLUMN "title" TO "name";

-- CreateIndex
CREATE UNIQUE INDEX "Exemplar_name_key" ON "Exemplar"("name");
