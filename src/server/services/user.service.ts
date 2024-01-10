import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";
import { validate } from "~/server/services/auth/verificationToken.service";

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  role: true,
  email: true,
  emailVerified: true,
  signupProvider: true,
});

export const findFirst = async (
  where: Partial<Prisma.UserWhereInput>,
  select: Prisma.UserSelect = defaultUserSelect,
) => {
  return await db.user.findFirst({
    where,
    select,
  });
};

export const findUnique = async (where: Prisma.UserWhereUniqueInput) => {
  return await db.user.findUnique({
    where,
    select: defaultUserSelect,
  });
};

export const findUniqueSensitive = async (where: Prisma.UserWhereUniqueInput) => {
  return await db.user.findUnique({
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

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await db.user.findMany({
    select: defaultUserSelect,
    skip,
    take,
  });
};

export const create = async (input: Prisma.UserCreateInput) => {
  return await db.user.create({
    data: input,
    select: defaultUserSelect,
  });
};

export const update = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select: Prisma.UserSelect = defaultUserSelect,
) => {
  return await db.user.update({ where, data, select });
};

export const remove = async (where: Prisma.UserWhereUniqueInput) => {
  return await db.user.delete({ where, select: defaultUserSelect });
};

export const verifyEmail = async (token: string) => {
  const validationResult = await validate(token, true);
  if (validationResult.status === "valid") {
    const user = await findUnique({ id: Number(validationResult.identifier) });

    if (!user) {
      //old link of a deleted user
      return "invalid";
    }
    if (!user.emailVerified) await update({ id: user.id }, { emailVerified: new Date() });
  }
  return validationResult.status;
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};
export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
