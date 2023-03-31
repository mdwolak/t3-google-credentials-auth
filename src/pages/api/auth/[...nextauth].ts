import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env/server.mjs";

import { ErrorCode } from "~/lib/errorCodes";

import { prisma } from "~/server/db";
import { authorize } from "~/server/services/auth";

const providers: Provider[] = [
  DiscordProvider({
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
  }),

  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    //TODO:https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option
    //allowDangerousEmailAccountLinking: true
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email Address", type: "email" },
      password: { label: "Password", type: "password" },
    },

    //Validates credentials and returns user object or null
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        console.error("E-mail and password are required.");
        throw new Error(ErrorCode.InternalServerError);
      }

      //Return user object which will be stored in JWT token
      return await authorize({
        email: credentials.email,
        password: credentials.password,
      });
      //Progresses to SignIn callback. More: https://next-auth.js.org/providers/credentials#example---username--password
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
    //Signin with etherum example
    // async session({ session, token }: { session: any; token: any }) {
    //   session.address = token.sub
    //   session.user.name = token.sub
    //   session.user.image = "https://www.fillmurray.com/128/128"
    //   return session
    // },
    //https://next-auth.js.org/configuration/callbacks#jwt-callback
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers,
  session: {
    strategy: "jwt",
  },
  // secret: "XH6bp/TkLvnUkQiPDEZNyHc0CV+VV5RL/n+HdVHoHN0=",
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
