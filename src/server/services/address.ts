import { Prisma } from "@prisma/client";

import { prisma } from "~/server/db";

export const defaultAddressSelect = Prisma.validator<Prisma.AddressSelect>()({
  id: true,
  line1: true,
  line2: true,
  city: true,
  county: true,
  postcode: true,
});

/**
 * READ
 */
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

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await prisma.address.findMany({
    select: {
      id: true,
      line1: true,
      line2: true,
      city: true,
      county: true,
      postcode: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    skip,
    take,
  });
};

/**
 * WRITE
 */
export const create = async (input: Prisma.AddressCreateInput) => {
  return await prisma.address.create({
    data: input,
    select: defaultAddressSelect,
  });
};

export const update = async (
  where: Partial<Prisma.AddressWhereUniqueInput>,
  data: Prisma.AddressUpdateInput,
  select: Prisma.AddressSelect = defaultAddressSelect
) => {
  return await prisma.address.update({ where, data, select });
};

export const remove = async (where: Prisma.AddressWhereUniqueInput) => {
  return await prisma.address.delete({ where, select: defaultAddressSelect });
};
