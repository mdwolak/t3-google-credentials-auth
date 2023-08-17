-- RenameColumn
ALTER TABLE "Address" RENAME COLUMN "createdBy" TO "createdById";
ALTER TABLE "Address" RENAME COLUMN "updatedBy" TO "updatedById";

ALTER TABLE "Exemplar" RENAME COLUMN "createdBy" TO "createdById";
ALTER TABLE "Exemplar" RENAME COLUMN "updatedBy" TO "updatedById";

-- AddForeignKey
ALTER TABLE "Exemplar" ADD CONSTRAINT "Exemplar_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exemplar" ADD CONSTRAINT "Exemplar_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "Exemplar" DROP CONSTRAINT "Exemplar_userId_fkey";

-- DropIndex
DROP INDEX "Address_line1_line2_postcode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Address_line1_postcode_key" ON "Address"("line1", "postcode");

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "userId",
ALTER COLUMN "createdById" DROP DEFAULT,
ALTER COLUMN "updatedById" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Exemplar" DROP COLUMN "userId",
ALTER COLUMN "createdById" DROP DEFAULT,
ALTER COLUMN "updatedById" DROP DEFAULT;