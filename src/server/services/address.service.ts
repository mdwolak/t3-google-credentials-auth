import { Prisma } from "@prisma/client";

import { type OmitAudit, getCreateProps, getUpdateProps, prisma } from "~/server/db";

export const defaultAddressSelect = Prisma.validator<Prisma.AddressSelect>()({
  id: true,
  line1: true,
  line2: true,
  city: true,
  county: true,
  postcode: true,
});

//
// READ

export const findFirst = async (
  where: Partial<Prisma.AddressWhereInput>,
  select: Prisma.AddressSelect = defaultAddressSelect
) => {
  return await prisma.address.findFirst({
    where,
    select,
  });
};

export const findUnique = async (
  where: Prisma.AddressWhereUniqueInput,
  select: Prisma.AddressSelect = defaultAddressSelect
) => {
  return await prisma.address.findUnique({
    where,
    select,
  });
};

export const findAll = async (orgId: number, page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  const where = { orgId };
  return await prisma.address.findMany({
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
  return await prisma.address.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultAddressSelect,
  });
};

export const update = async (
  userId: number,
  where: Partial<Prisma.AddressWhereUniqueInput>,
  data: OmitAudit<Prisma.AddressUpdateInput>,
  select: Prisma.AddressSelect = defaultAddressSelect
) => {
  return await prisma.address.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.AddressWhereUniqueInput) => {
  return await prisma.address.delete({ where, select: defaultAddressSelect });
};
