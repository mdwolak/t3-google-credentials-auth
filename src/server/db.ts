import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { env } from "../env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export type OmitAudit<T> = Omit<T, "createdAt" | "createdById" | "updatedAt" | "updatedById">;

/*
  Check type of prisma error.
  Error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes    
*/
export function getConstraintViolationFields(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" //"Unique constraint failed on the {constraint}"
  )
    return error.meta?.target as string[];

  return null;
}

export function isNotFoundError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025" //An operation failed because it depends on one or more records that were required but not found. {cause}
  );
}

export function getCreateProps(userId: number) {
  return { createdById: userId, updatedById: userId };
}

export function getUpdateProps(userId: number) {
  return { updatedById: userId };
}
