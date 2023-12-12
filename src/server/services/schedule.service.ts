import { Prisma } from "@prisma/client";

import { type OmitAudit, db, getCreateProps, getUpdateProps } from "~/server/db";

export const defaultScheduleSelect = Prisma.validator<Prisma.ScheduleSelect>()({
  id: true,
  name: true,
  createdById: true,
});

//
// READ

export const findFirst = async (where: Partial<Prisma.ScheduleWhereInput>) => {
  return await db.schedule.findFirst({
    where,
    select: defaultScheduleSelect,
  });
};

export const findUnique = async (where: Prisma.ScheduleWhereUniqueInput) => {
  return await db.schedule.findUnique({
    where,
    select: defaultScheduleSelect,
  });
};

// return await prisma.scheduleDay.findMany({
//   where: { scheduleId },
//   select: {
//     id: true,
//     dayOfWeek: true,
//     startTime: true,
//     duration: true,
//     scheduleId: true,
//   },
//   orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
// });

export const findByActivityId = async (activityId: number) => {
  return await db.schedule.findMany({
    where: { activityId },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      activityId: true,
      createdAt: true,
      scheduleDays: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          duration: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await db.schedule.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      activityId: true,
      createdAt: true,
      scheduleDays: {
        select: {
          //id: true,
          dayOfWeek: true,
          startTime: true,
          //duration: true,
        },
        orderBy: [{ dayOfWeek: "asc" }],
      },
    },
    skip,
    take,
  });
};

//
// WRITE

export const create = async (userId: number, input: OmitAudit<Prisma.ScheduleCreateInput>) => {
  return await db.schedule.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultScheduleSelect,
  });
};

export const update = async (
  userId: number,
  where: Prisma.ScheduleWhereUniqueInput,
  data: Omit<OmitAudit<Prisma.ScheduleUpdateInput>, "activity">,
  select: Prisma.ScheduleSelect = defaultScheduleSelect
) => {
  return await db.schedule.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ScheduleWhereUniqueInput) => {
  return await db.schedule.delete({ where, select: defaultScheduleSelect });
};
