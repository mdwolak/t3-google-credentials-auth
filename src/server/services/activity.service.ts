import { ActivityStatus, Prisma } from "@prisma/client";

import { type OmitAudit, getCreateProps, getUpdateProps, prisma } from "~/server/db";

export const defaultActivitySelect = Prisma.validator<Prisma.ActivitySelect>()({
  id: true,
  name: true,
});

//
// READ

export const findFirst = async (
  where: Partial<Prisma.ActivityWhereInput>,
  select: Prisma.ActivitySelect = defaultActivitySelect
) => {
  return await prisma.activity.findFirst({
    where,
    select,
  });
};

export const findUnique = async (
  where: Prisma.ActivityWhereUniqueInput,
  select: Prisma.ActivitySelect = defaultActivitySelect
) => {
  return await prisma.activity.findUnique({
    where,
    select,
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      addressId: true,
      duration: true,
      visible: true,
      createdAt: true,
    },
    skip,
    take,
  });
};

//
// WRITE

export const create = async (userId: number, input: OmitAudit<Prisma.ActivityCreateInput>) => {
  return await prisma.activity.create({
    data: { ...input, ...getCreateProps(userId), slug: input.name, status: ActivityStatus.Draft },
    select: defaultActivitySelect,
  });
};

export const update = async (
  userId: number,
  where: Partial<Prisma.ActivityWhereUniqueInput>,
  data: OmitAudit<Prisma.ActivityUpdateInput>,
  select: Prisma.ActivitySelect = defaultActivitySelect
) => {
  return await prisma.activity.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ActivityWhereUniqueInput) => {
  return await prisma.activity.delete({ where, select: defaultActivitySelect });
};
