import { Prisma } from "@prisma/client";

import { prisma } from "~/server/db";

export const defaultExemplarSelect = Prisma.validator<Prisma.ExemplarSelect>()({
  id: true,
  title: true,
});

/**
 * READ
 */
export const findFirst = async (
  where: Partial<Prisma.ExemplarWhereInput>,
  select: Prisma.ExemplarSelect = defaultExemplarSelect
) => {
  return await prisma.exemplar.findFirst({
    where,
    select,
  });
};

export const findUniqueOrThrow = async (
  where: Prisma.ExemplarWhereUniqueInput,
  select: Prisma.ExemplarSelect = defaultExemplarSelect
) => {
  return await prisma.exemplar.findUniqueOrThrow({
    where,
    select,
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await prisma.exemplar.findMany({
    select: {
      id: true,
      title: true,
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
export const create = async (input: Prisma.ExemplarCreateInput) => {
  return await prisma.exemplar.create({
    data: input,
    select: defaultExemplarSelect,
  });
};

export const update = async (
  where: Partial<Prisma.ExemplarWhereUniqueInput>,
  data: Prisma.ExemplarUpdateInput,
  select: Prisma.ExemplarSelect = defaultExemplarSelect
) => {
  return await prisma.exemplar.update({ where, data, select });
};

export const remove = async (where: Prisma.ExemplarWhereUniqueInput) => {
  return await prisma.exemplar.delete({ where, select: defaultExemplarSelect });
};
