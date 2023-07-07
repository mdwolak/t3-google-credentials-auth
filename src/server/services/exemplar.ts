import type { Exemplar, Prisma } from "@prisma/client";

import { prisma } from "~/server/db";

/**
 * READ
 */
export const findFirst = async (
  where: Partial<Prisma.ExemplarWhereInput>,
  select?: Prisma.ExemplarSelect
) => {
  return (await prisma.exemplar.findFirst({
    where,
    select,
  })) as Exemplar;
};

export const findUniqueOrThrow = async (
  where: Prisma.ExemplarWhereUniqueInput,
  select?: Prisma.ExemplarSelect
) => {
  return (await prisma.exemplar.findUniqueOrThrow({
    where,
    select,
  })) as Exemplar;
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return (await prisma.exemplar.findMany({
    include: { user: { select: { id: true, name: true } } },
    skip,
    take,
  })) as Exemplar[];
};

/**
 * WRITE
 */
export const create = async (input: Prisma.ExemplarCreateInput) => {
  return (await prisma.exemplar.create({
    data: input,
  })) as Exemplar;
};

export const update = async (
  where: Partial<Prisma.ExemplarWhereUniqueInput>,
  data: Prisma.ExemplarUpdateInput,
  select?: Prisma.ExemplarSelect
) => {
  return (await prisma.exemplar.update({ where, data, select })) as Exemplar;
};

export const remove = async (where: Prisma.ExemplarWhereUniqueInput) => {
  return await prisma.exemplar.delete({ where });
};
