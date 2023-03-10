import type { Prisma, User } from "@prisma/client";

import { prisma } from "~/server/db";

const excludedFields = ["password"];

export const create = async (input: Prisma.UserCreateInput) => {
  //IMPROVE: do not return sensitive data post-creation
  return (await prisma.user.create({
    data: input,
  })) as User;
};

export const findFirst = async (
  where: Partial<Prisma.UserWhereInput>,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findFirst({
    where,
    select,
  })) as User;
};

export const findUnique = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const update = async (
  where: Partial<Prisma.UserWhereUniqueInput>,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.update({ where, data, select })) as User;
};
