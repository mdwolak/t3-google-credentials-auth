import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/server/db";

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
  updatedAt: true,
  role: true,
});

export const findFirst = async (
  where: Partial<Prisma.UserWhereInput>,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return await prisma.user.findFirst({
    where,
    select,
  });
};

export const findUnique = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({
    where,
    select: defaultUserSelect,
  });
};

export const findUniqueSensitive = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({
    where,
    select: {
      id: true,
      // username: true,
      name: true,
      email: true,
      emailVerified: true,
      // identityProvider: true,
      //image: true,
      password: true,
      //createdDate: true,
      role: true,
      orgId: true,
    },
  });
};

export const create = async (input: Prisma.UserCreateInput) => {
  //IMPROVE: do not return sensitive data exemplar-creation
  return await prisma.user.create({
    data: input,
    select: defaultUserSelect,
  });
};

export const update = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return await prisma.user.update({ where, data, select });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};
export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
