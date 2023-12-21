import { type SessionUser } from "next-auth";

import { UserRole } from "@prisma/client";

export const isAdmin = (user: SessionUser): boolean => {
  return user?.role === UserRole.Admin;
};

export function canUpdate(user: SessionUser, permittedUserId: number): boolean {
  if (!user) return false;

  if (!permittedUserId) throw new Error("PermittedUserId has not been provided.");
  if (user.id === permittedUserId) return true;

  return isAdmin(user);
}
