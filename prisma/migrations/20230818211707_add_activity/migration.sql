-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Draft', 'Planned', 'OpenToRegistrations', 'ClosedToRegistrations', 'Ongoing', 'Past', 'Cancelled');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "addressId" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "status" "ActivityStatus" NOT NULL,
    "data" JSONB,
    "owningGroupId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "Activity"("name");
