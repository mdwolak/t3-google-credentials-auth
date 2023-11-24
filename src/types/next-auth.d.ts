import { type DefaultSession } from "next-auth";

import type { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: User;
  }

  interface User extends Omit<DefaultSession["user"], "image"> {
    id: PrismaUser["id"];
    role: PrismaUser["role"];
    orgId: PrismaUser["orgId"];
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: PrismaUser["id"];
    name: PrismaUser["name"];
    email: PrismaUser["email"];
    role: PrismaUser["role"];
    orgId: PrismaUser["orgId"];
    emailVerified: boolean;
  }
}
