import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/src/env/server.mjs";
import { prisma } from "@/src/server/db/client";
import { authorize, ErrorCode } from "@/src/lib/auth";

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
    name: "credentials",
    credentials: {
      email: { label: "Email Address", type: "email" },
      password: { label: "Password", type: "password" },
    },

    async authorize(credentials) {
      if (!credentials || credentials.email || credentials.password) {
        console.error("E-mail and password are required.");
        throw new Error(ErrorCode.InternalServerError);
      }
      return await authorize({
        email: credentials?.email,
        password: credentials?.password,
      });
    },
  }),
];

export const authOptions: NextAuthOptions = {
  // Include user.id in session
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
    // error: "/auth/error", //@ Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify",
    // newUser: "/auth/new", //@ New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers,
  // secret: "XH6bp/TkLvnUkQiPDEZNyHc0CV+VV5RL/n+HdVHoHN0=",
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
