import { Prisma } from "@prisma/client";

import { type OmitAudit, getCreateProps, getUpdateProps, prisma } from "~/server/db";

export const defaultScheduleSelect = Prisma.validator<Prisma.ScheduleSelect>()({
  id: true,
  name: true,
});

//
// READ

export const findFirst = async (
  where: Partial<Prisma.ScheduleWhereInput>,
  select: Prisma.ScheduleSelect = defaultScheduleSelect
) => {
  return await prisma.schedule.findFirst({
    where,
    select,
  });
};

export const findUnique = async (
  where: Prisma.ScheduleWhereUniqueInput,
  select: Prisma.ScheduleSelect = defaultScheduleSelect
) => {
  return await prisma.schedule.findUnique({
    where,
    select,
  });
};

export const findByActivityId = async (activityId: number) => {
  return await prisma.schedule.findMany({
    where: { activityId },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      activityId: true,
      createdAt: true,
    },
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await prisma.schedule.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      activityId: true,
      createdAt: true,
    },
    skip,
    take,
  });
};

//
// WRITE

export const create = async (userId: number, input: OmitAudit<Prisma.ScheduleCreateInput>) => {
  return await prisma.schedule.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultScheduleSelect,
  });
};

export const update = async (
  userId: number,
  where: Partial<Prisma.ScheduleWhereUniqueInput>,
  data: Omit<OmitAudit<Prisma.ScheduleUpdateInput>, "activity">,
  select: Prisma.ScheduleSelect = defaultScheduleSelect
) => {
  return await prisma.schedule.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ScheduleWhereUniqueInput) => {
  return await prisma.schedule.delete({ where, select: defaultScheduleSelect });
};
