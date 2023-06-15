import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { type Context } from "~/server/api/context";

export function getPrismaUserFromContext(ctx: Context) {
  return { connect: { id: ctx.session?.user?.id } };
}

export function throwConflictWithZodError(entityName: string, conflictingAttributes: string[]) {
  const attributes = conflictingAttributes.join(" and ");
  const message = `${entityName} with the same ${attributes} already exists`;

  const zodError = new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      message,
      path: conflictingAttributes,
    },
  ]);
  throwConflict(message, zodError);
}
export function throwConflict(message: string, cause?: unknown) {
  throw new TRPCError({
    code: "CONFLICT",
    message,
    cause,
  });
}

export function throwNotFound(entityName: string) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: `The requested ${entityName} was not found`,
  });
}

export function throwInternalServerError(error: unknown) {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: (error as Error).message,
  });
}
