import { Prisma } from "@prisma/client";

import { type OmitAudit, getCreateProps, getUpdateProps, prisma } from "~/server/db";

export const defaultScheduleDaySelect = Prisma.validator<Prisma.ScheduleDaySelect>()({
  id: true,
});

//
// READ

export const findFirst = async (
  where: Partial<Prisma.ScheduleDayWhereInput>,
  select: Prisma.ScheduleDaySelect = defaultScheduleDaySelect
) => {
  return await prisma.scheduleDay.findFirst({
    where,
    select,
  });
};

export const findUnique = async (
  where: Prisma.ScheduleDayWhereUniqueInput,
  select: Prisma.ScheduleDaySelect = defaultScheduleDaySelect
) => {
  return await prisma.scheduleDay.findUnique({
    where,
    select,
  });
};

//TODO: remove
export const findByScheduleId = async (scheduleId: number) => {
  return await prisma.scheduleDay.findMany({
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
  return await prisma.scheduleDay.findMany({
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
  return await prisma.scheduleDay.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultScheduleDaySelect,
  });
};

export const update = async (
  userId: number,
  where: Partial<Prisma.ScheduleDayWhereUniqueInput>,
  data: OmitAudit<Prisma.ScheduleDayUpdateInput>,
  select: Prisma.ScheduleDaySelect = defaultScheduleDaySelect
) => {
  return await prisma.scheduleDay.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ScheduleDayWhereUniqueInput) => {
  return await prisma.scheduleDay.delete({ where, select: defaultScheduleDaySelect });
};
