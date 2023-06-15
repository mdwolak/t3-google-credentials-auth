import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { env } from "../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prismaMock: PrismaClient | undefined;
}

export const prisma =
  global.prismaMock ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prismaMock = prisma;
}

/*
  Check type of prisma error.
  Error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes    
*/
export function IsUniqueConstraintViolation(error: unknown, attributes: Array<string>) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" && //"Unique constraint failed on the {constraint}"
    Array.isArray(error.meta?.target) &&
    error.meta?.target.sort().join(",") === attributes.sort().join(",")
  );
}

export function IsNotFoundError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025" //An operation failed because it depends on one or more records that were required but not found. {cause}
  );
}
