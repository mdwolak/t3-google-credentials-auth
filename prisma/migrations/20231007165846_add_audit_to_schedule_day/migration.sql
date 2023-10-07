/*
  Warnings:

  - Added the required column `createdById` to the `ScheduleDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ScheduleDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `ScheduleDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduleDay" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" INTEGER NOT NULL;
