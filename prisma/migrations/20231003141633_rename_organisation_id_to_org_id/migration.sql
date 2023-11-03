/*
  Warnings:

  - You are about to rename the column `organisationId` to `orgId` on the `Activity` table. All the data in the column will be preserved.
  - You are about to rename the column `organisationId` to `orgId` on the `Address` table. All the data in the column will be preserved.
*/

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_organisationId_fkey";

-- RenameColumn
ALTER TABLE "Activity" RENAME COLUMN "organisationId" TO "orgId";

-- RenameColumn
ALTER TABLE "Address" RENAME COLUMN "organisationId" TO "orgId";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
