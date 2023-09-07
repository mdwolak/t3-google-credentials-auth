import { UserRole } from "@prisma/client";

import { type Context } from "~/server/api/context";

export const isAdmin = (ctx: Context): boolean => {
  return ctx.session?.user?.role === UserRole.Admin;
};

export function canUpdate<T extends Record<string, any>>(
  ctx: Context,
  object: T,
  idField: keyof T
): boolean {
  if (!ctx.session) return false;
  if (isAdmin(ctx)) return true;

  return object[idField] === ctx.session.user?.id;
}
