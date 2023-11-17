import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { env } from "~/env/server.mjs";
import { createUserSchema, forgotPasswordSchema } from "~/lib/schemas/user.schema";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  type ErrorHandlerOptions,
  getErrorFromUnknown,
  handleRequest,
  httpConflictWithZod,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import { generateVerificationToken } from "~/server/services/auth/token.service";
import * as userService from "~/server/services/user.service";

const errorHandler = (error: unknown) => {
  const errorHandlerOptions: ErrorHandlerOptions = {
    entityName: "User",
  };

  throw getErrorFromUnknown(error, errorHandlerOptions);
};

export const userRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  create: publicProcedure.input(createUserSchema).mutation(({ input }) =>
    handleRequest(async () => {
      const existingUser = await userService.findUnique({ email: input.email.toLowerCase() });
      if (existingUser) {
        throw httpConflictWithZod(getZodErrorWithCustomIssue("Email already taken", ["email"]));
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const user = await userService.create({
        email: input.email.toLocaleLowerCase(),
        name: input.name,
        password: hashedPassword,
      });

      return { user };
    }, errorHandler)
  ),
  forgotPassword: publicProcedure.input(forgotPasswordSchema).mutation(async ({ input }) => {
    const user = await userService.findUnique({ email: input.email.toLowerCase() });
    // TODO: decide if we want to send a message to the user if the email is not found
    if (user) {
      const token = await generateVerificationToken(
        user.id.toString(),
        new Date(new Date().setHours(2))
      );
      const resetLink = `${env.NEXTAUTH_URL}/auth/forgot-password/${token}`;
      await sendPasswordResetLink(user, resetLink);
    }
    return null;
  }),
});

const sendPasswordResetLink = async (user: Pick<User, "id" | "name">, resetLink: string) => {
  //todo: send email
  console.log(resetLink);
};
