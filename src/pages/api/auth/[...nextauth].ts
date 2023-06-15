import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env/server.mjs";
import { isNumber } from "~/lib/common";
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
    //allowDangerousEmailAccountLinking: true //https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email Address", type: "email" },
      password: { label: "Password", type: "password" },
    },

    //Validates credentials and returns user object or null
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        throw new Error(ErrorCode.EmailAndPasswordAreRequired);
      }

      //Return user object which will be stored in JWT token
      return (await authorize({
        email: credentials.email,
        password: credentials.password,
      })) as never;
      //Progresses to SignIn callback. More: https://next-auth.js.org/providers/credentials#example---username--password
    },
  }),
];

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user && isNumber(token.sub)) {
        session.user.id = Number(token.sub);
        session.user.image = session.user.image || null;
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: Number(user.id),
        };
      }
      return token;
    },
    //https://next-auth.js.org/configuration/callbacks#jwt-callback
  },
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
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
