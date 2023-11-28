import "next-auth";

import type { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: SessionUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends Omit<PrismaUser, "password" | "provider" | "createdDate" | "updatedAt"> {
    id: PrismaUser["id"];
  }

  type SessionUser = JWT; //derives fully from JWT avoiding extra db calls
}

declare module "next-auth/jwt" {
  interface JWT {
    //sent with every request; must stay compact
    id: PrismaUser["id"];
    name: string;
    email: PrismaUser["email"];
    role: PrismaUser["role"];
    orgId: PrismaUser["orgId"];
    emailVerified: boolean;
  }
}
