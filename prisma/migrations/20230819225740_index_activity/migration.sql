/*
  Warnings:

  - The values [USER,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[owningGroupId,name]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owningGroupId,slug]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('User', 'Admin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';

-- CreateIndex
CREATE UNIQUE INDEX "Activity_owningGroupId_name_key" ON "Activity"("owningGroupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_owningGroupId_slug_key" ON "Activity"("owningGroupId", "slug");
