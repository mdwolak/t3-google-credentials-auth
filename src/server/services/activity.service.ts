import { ActivityStatus, Prisma } from "@prisma/client";

import { type OmitAudit, db, getCreateProps, getUpdateProps } from "~/server/db";

export const defaultActivitySelect = Prisma.validator<Prisma.ActivitySelect>()({
  id: true,
  name: true,
  orgId: true,
  status: true,
  createdById: true,
});

//
// READ

export const findFirst = async (where: Prisma.ActivityWhereInput) => {
  return await db.activity.findFirst({
    where,
    select: defaultActivitySelect,
  });
};

export const findUnique = async (where: Prisma.ActivityWhereUniqueInput) => {
  return await db.activity.findUnique({
    where,
    select: defaultActivitySelect,
  });
};

export const findAll = async (orgId: number, page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  const where = { orgId };
  return await db.activity.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      addressId: true,
      duration: true,
      visible: true,
      createdAt: true,
    },
    where,
    skip,
    take,
  });
};

//
// WRITE

export const create = async (
  userId: number,
  //TODO: use type CreateActivityInput
  input: OmitAudit<Prisma.ActivityUncheckedCreateInput>
) => {
  return await db.activity.create({
    data: { ...input, ...getCreateProps(userId), slug: input.name, status: ActivityStatus.Draft },
    select: defaultActivitySelect,
  });
};

export const update = async (
  userId: number,
  where: Prisma.ActivityWhereUniqueInput,
  data: OmitAudit<Prisma.ActivityUpdateInput>,
  select: Prisma.ActivitySelect = defaultActivitySelect
) => {
  return await db.activity.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ActivityWhereUniqueInput) => {
  return await db.activity.delete({ where, select: defaultActivitySelect });
};
