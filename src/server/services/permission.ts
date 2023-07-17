import { UserRole } from "@prisma/client";

import { type Context } from "~/server/api/context";

export const isAdmin = (ctx: Context): boolean => {
  return ctx.session?.user?.role === UserRole.ADMIN;
};

export function canUpdate(ctx: Context, object: any, idField = "createdBy"): boolean {
  if (!ctx.session) return false;
  if (isAdmin(ctx)) return true;

  return (object as any)[idField] === ctx.session.user?.id;
}
