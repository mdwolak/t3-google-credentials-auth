import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import {
  type CreateUserInput,
  type LoginUserInput,
  createUserSchema,
  loginUserSchema,
} from "~/server/api/routers/user.schemas";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import { createUser, findUser } from "~/server/services/user";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  registerUser: publicProcedure
    .input(createUserSchema)
    .mutation(({ input }) => registerHandler({ input })),
});

export const registerHandler = async ({ input }: { input: CreateUserInput }) => {
  let user = await findUser({ email: input.email });
  if (user) {
    throw new TRPCError({ code: "CONFLICT", message: "Email already taken" });
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);
  user = await createUser({
    email: input.email,
    name: input.name,
    password: hashedPassword,
    //TODO: introduce provider enum
    //provider: "local",
  });

  return {
    status: "success",
    data: {
      user,
    },
  };
};
