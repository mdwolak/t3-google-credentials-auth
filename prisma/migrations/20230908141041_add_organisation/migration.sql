-- CreateEnum
CREATE TYPE "OrganisationStatus" AS ENUM ('Prospect', 'Lead', 'Draft', 'Preapproval', 'Active', 'Inactive', 'Suspended', 'Archived');

-- CreateEnum
CREATE TYPE "OrganisationType" AS ENUM ('Nonprofit', 'SelfEmployed', 'Company');

-- CreateTable
CREATE TABLE "Organisation" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "OrganisationType" NOT NULL DEFAULT 'Company',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "status" "OrganisationStatus" NOT NULL DEFAULT 'Draft',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_parentId_name_key" ON "Organisation"("parentId", "name");
