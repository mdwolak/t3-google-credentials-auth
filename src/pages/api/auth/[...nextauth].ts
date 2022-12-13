import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

import { ErrorCode } from "../../../lib/auth";

const providers: Provider[] = [
  DiscordProvider({
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
  }),

  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }),
  CredentialsProvider({
    // id: "credentials",
    name: "custom",
    // type: "credentials",
    credentials: {
      email: { label: "Email Address", type: "email" },
      password: { label: "Password", type: "password" },
    },

    async authorize(credentials) {
      if (!credentials) {
        console.error("Credentials have not been provided");
        throw new Error(ErrorCode.InternalServerError);
      }

      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email.toLowerCase(),
        },
        select: {
          id: true,
          // username: true,
          name: true,
          email: true,
          // identityProvider: true,
          image: true,
          password: true,
          createdDate: true,
        },
      });

      if (!user) {
        throw new Error(ErrorCode.UserNotFound);
      }

      if (!user.password) {
        //TODO: how can this happen?
        throw new Error(ErrorCode.UserMissingPassword);
      }

      const isCorrectPassword = await comparePasswords(
        credentials.password,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error(ErrorCode.IncorrectPassword);
      }

      // const limiter = rateLimit({
      //   intervalInMs: 60 * 1000, // 1 minute
      // });
      // await limiter.check(10, user.email); // 10 requests per minute

      //TODO: check password requirements

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }, //end of authorize
  }),
];

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    //https://next-auth.js.org/configuration/callbacks#jwt-callback
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/logout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify",
    // newUser: "/auth/new", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers,
  // secret: "XH6bp/TkLvnUkQiPDEZNyHc0CV+VV5RL/n+HdVHoHN0=",
  debug: process.env.NODE_ENV === "development",
};

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
) {
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  return isValid;
}

export default NextAuth(authOptions);
