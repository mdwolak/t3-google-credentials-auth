import { Prisma } from "@prisma/client";

import { type OmitAudit, db, getCreateProps, getUpdateProps } from "~/server/db";

export const defaultAddressSelect = Prisma.validator<Prisma.AddressSelect>()({
  id: true,
  line1: true,
  line2: true,
  city: true,
  county: true,
  postcode: true,
  createdById: true,
});

//
// READ

export const findFirst = async (where: Prisma.AddressWhereInput) => {
  return await db.address.findFirst({
    where,
    select: defaultAddressSelect,
  });
};

export const findUnique = async (where: Prisma.AddressWhereUniqueInput) => {
  return await db.address.findUnique({
    where,
    select: defaultAddressSelect,
  });
};

export const findAll = async (orgId: number, page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  const where = { orgId };
  return await db.address.findMany({
    select: {
      id: true,
      line1: true,
      line2: true,
      city: true,
      county: true,
      postcode: true,
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
  input: OmitAudit<Prisma.AddressUncheckedCreateInput>
) => {
  return await db.address.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultAddressSelect,
  });
};

export const update = async (
  userId: number,
  where: Prisma.AddressWhereUniqueInput,
  data: OmitAudit<Prisma.AddressUpdateInput>,
  select: Prisma.AddressSelect = defaultAddressSelect
) => {
  return await db.address.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.AddressWhereUniqueInput) => {
  return await db.address.delete({ where, select: defaultAddressSelect });
};
