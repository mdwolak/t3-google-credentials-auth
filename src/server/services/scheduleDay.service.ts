import { Prisma } from "@prisma/client";

import { type OmitAudit, db, getCreateProps, getUpdateProps } from "~/server/db";

export const defaultScheduleDaySelect = Prisma.validator<Prisma.ScheduleDaySelect>()({
  id: true,
  dayOfWeek: true,
  createdById: true,
  scheduleId: true,
});

//
// READ

export const findFirst = async (where: Partial<Prisma.ScheduleDayWhereInput>) => {
  return await db.scheduleDay.findFirst({
    where,
    select: defaultScheduleDaySelect,
  });
};

export const findUnique = async (where: Prisma.ScheduleDayWhereUniqueInput) => {
  return await db.scheduleDay.findUnique({
    where,
    select: defaultScheduleDaySelect,
  });
};

//TODO: remove
export const findByScheduleId = async (scheduleId: number) => {
  return await db.scheduleDay.findMany({
    where: { scheduleId },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      duration: true,
      scheduleId: true,
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await db.scheduleDay.findMany({
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      duration: true,
      scheduleId: true,
    },
    skip,
    take,
  });
};

//
// WRITE

export const create = async (
  userId: number,
  input: OmitAudit<Prisma.ScheduleDayUncheckedCreateInput>
) => {
  return await db.scheduleDay.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultScheduleDaySelect,
  });
};

export const update = async (
  userId: number,
  where: Prisma.ScheduleDayWhereUniqueInput,
  data: OmitAudit<Prisma.ScheduleDayUpdateInput>,
  select: Prisma.ScheduleDaySelect = defaultScheduleDaySelect
) => {
  return await db.scheduleDay.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ScheduleDayWhereUniqueInput) => {
  return await db.scheduleDay.delete({ where, select: defaultScheduleDaySelect });
};
