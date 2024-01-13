import "next-auth";

import type { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user?: SessionUser;
  }

  /**
   * Returned by CredentialsProvider.authorize(). A supertype of AdapterUser which correlates to the User prisma model.
   */
  interface User extends Omit<PrismaUser, "password" | "provider" | "createdAt" | "updatedAt"> {
    id: PrismaUser["id"];
  }

  /**
   * Built entirely from the JWT token.
   */
  interface SessionUser {
    id: PrismaUser["id"];
    role: PrismaUser["role"];
    orgId: PrismaUser["orgId"];
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  /**
   * Sent with every request. Must stay compact.
   */
  interface JWT {
    // name: string;
    // email: PrismaUser["email"];
    role: PrismaUser["role"];
    orgId: PrismaUser["orgId"];
    emailVerified: boolean;
  }
}
