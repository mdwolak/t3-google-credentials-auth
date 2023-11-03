/*
  Warnings:

  - A unique constraint covering the columns `[orgId,name,status]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orgId,line1,postcode]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,dayOfWeek]` on the table `ScheduleDay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Address_line1_postcode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Activity_orgId_name_status_key" ON "Activity"("orgId", "name", "status");

-- CreateIndex
CREATE INDEX "Address_orgId_line1_postcode_idx" ON "Address"("orgId", "line1", "postcode");

-- CreateIndex
CREATE INDEX "Schedule_activityId_idx" ON "Schedule"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleDay_scheduleId_dayOfWeek_key" ON "ScheduleDay"("scheduleId", "dayOfWeek");
