import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions, Session } from "next-auth";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env/server.mjs";
import { ErrorCode } from "~/lib/errorCodes";
import { prisma } from "~/server/db";
import * as userService from "~/server/services/user.service";

const providers: Provider[] = [
  DiscordProvider({
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
  }),

  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true, //https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option
    authorization: {
      params: {
        prompt: "consent", //confirm which account to use
        access_type: "offline", //request refresh_token
      },
    },
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email Address", type: "email" },
      password: { label: "Password", type: "password" },
    },

    //Validates credentials and returns user object or null
    async authorize(credentials) {
      if (!credentials) {
        throw new Error(ErrorCode.EmailAndPasswordAreRequired);
      }

      const dbUser = await userService.findUniqueSensitive({
        email: credentials.email.toLowerCase(),
      });

      if (
        !dbUser ||
        !dbUser.password ||
        !(await userService.verifyPassword(credentials.password, dbUser.password))
      )
        throw new Error(ErrorCode.InvalidEmailOrPassword);

      //Return user object which will be stored in JWT token
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        orgId: dbUser.orgId,
        emailVerified: dbUser.emailVerified,
      };

      //Progresses to SignIn callback. More: https://next-auth.js.org/providers/credentials#example---username--password
    },
  }),
];

export const authOptions: NextAuthOptions = {
  //https://next-auth.js.org/configuration/callbacks
  callbacks: {
    //the callback is called with all args (incl. account, profile, isNewUser ) when a JSON Web Token is created (when a user signs in)
    //after that is it called when session is accessed (all args except token are then undefined, so you only pass-through the token)
    async jwt({ token, user, trigger, session }) {
      //user object holds information extracted from the profile and is only passed the first time this callback is called (after the user signs in)
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, email, picture, ...requiredTokenProps } = token;
        return {
          ...requiredTokenProps,
          role: user.role,
          orgId: user.orgId,
          emailVerified: !!user.emailVerified,
        } satisfies JWT;
      }
      if (trigger === "update" && session == "emailVerified") {
        const dbUser = await userService.findUnique({ id: token.id as number });
        return {
          ...token,
          emailVerified: !!dbUser?.emailVerified,
        };
      }
      return token;
    },
    //the callback is called whenever session is accessed (by the client or in the API route) and ONLY if client has been authenticated
    //the desired session object must be recreated every time
    //the user property in the session arg is always passed with mere name, email & image (DefaultSession["user"])
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: Number(token.sub),
          role: token.role,
          orgId: token.orgId,
          emailVerified: token.emailVerified,
        },
      } satisfies Session;
    },
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
