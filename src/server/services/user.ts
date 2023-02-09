import type { Prisma, User } from "@prisma/client";

import { prisma } from "~/server/db";

export const excludedFields = ["password", "verified", "verificationCode"];

export const createUser = async (input: Prisma.UserCreateInput) => {
  //IMPROVE: do not return sensitive data post-creation
  return (await prisma.user.create({
    data: input,
  })) as User;
};

export const findUser = async (
  where: Partial<Prisma.UserCreateInput>,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findFirst({
    where,
    select,
  })) as User;
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const updateUser = async (
  where: Partial<Prisma.UserWhereUniqueInput>,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.update({ where, data, select })) as User;
};
