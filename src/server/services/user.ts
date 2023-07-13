import { Prisma, type User } from "@prisma/client";

import { prisma } from "~/server/db";

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  //email: true,
  name: true,
  image: true,
  updatedAt: true,
  role: true,
});

export const findFirst = async (
  where: Partial<Prisma.UserWhereInput>,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return (await prisma.user.findFirst({
    where,
    select,
  })) as User;
};

export const findUnique = async (
  where: Prisma.UserWhereUniqueInput,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const create = async (input: Prisma.UserCreateInput) => {
  //IMPROVE: do not return sensitive data exemplar-creation
  return (await prisma.user.create({
    data: input,
    select: defaultUserSelect,
  })) as User;
};

export const update = async (
  where: Partial<Prisma.UserWhereUniqueInput>,
  data: Prisma.UserUpdateInput,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return (await prisma.user.update({ where, data, select })) as User;
};
