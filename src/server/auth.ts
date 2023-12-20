import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { cache } from "react";

import { AuthProviderType, type Prisma } from "@prisma/client";

import { env } from "~/env.mjs";
import { ErrorCode } from "~/lib/errorCodes";
import { db } from "~/server/db";
import * as userService from "~/server/services/user.service";

const providers: Provider[] = [
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
    authorize,
  }),
];

//Validates credentials and returns user object or null
export async function authorize(credentials: { email: string; password: string } | undefined) {
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
    signupProvider: null,
  };

  //Progresses to SignIn callback. More: https://next-auth.js.org/providers/credentials#example---username--password
}

export const authOptions: NextAuthOptions = {
  //https://next-auth.js.org/configuration/callbacks
  callbacks: {
    //the callback is called with all args (incl. account, profile, isNewUser ) when a JSON Web Token is created (when a user signs in)
    async jwt({ token, user, account, trigger, session, profile }) {
      if (!trigger) return token; //token already issued

      if (trigger === "update") {
        //useSession().update() was called
        if (session != "emailVerified") throw new Error("Unexpected session update: " + session);

        return {
          ...token,
          emailVerified: true,
        };
      }

      //trigger = "signIn" | "signUp" and user has full db record

      //update User table from OAuth profile
      let dbUser = user;
      if (account?.provider === "google" && profile) {
        const gProfile = profile as GoogleProfile;
        const data: Prisma.UserUpdateInput = {};
        //warning: if props can be updated in the app, they should not be overwritten here
        if (!dbUser.emailVerified && gProfile.email_verified) data.emailVerified = new Date();
        if (dbUser.image !== gProfile.picture && gProfile.picture) data.image = gProfile.picture;
        if (dbUser.name !== gProfile.name && gProfile.name) data.name = gProfile.name;
        if (!dbUser.signupProvider) data.signupProvider = AuthProviderType.Google;

        if (Object.keys(data).length > 0) {
          dbUser = await userService.update({ id: Number(dbUser.id) }, data);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, email, picture, ...requiredTokenProps } = token;
      return {
        ...requiredTokenProps,
        role: dbUser.role,
        orgId: dbUser.orgId,
        emailVerified: !!dbUser.emailVerified,
      } satisfies JWT;
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
  adapter: PrismaAdapter(db),
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

export const getSession = cache(() => getServerSession(authOptions));

export const getRequiredSessionUser = async () => {
  const session = await getSession();
  if (!session || !session.user) return redirect("/auth/signin");
  return session.user;
};
