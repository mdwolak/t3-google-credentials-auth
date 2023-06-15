import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import { type CreateUserInput, createUserSchema } from "~/lib/schemas/user";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import * as userService from "~/server/services/user";

export const userRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  create: publicProcedure.input(createUserSchema).mutation(({ input }) => createHandler({ input })),
});

const createHandler = async ({ input }: { input: CreateUserInput }) => {
  let user = await userService.findUnique({ email: input.email.toLowerCase() });
  if (user) {
    throw new TRPCError({ code: "CONFLICT", message: "Email already taken" });
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);
  user = await userService.create({
    email: input.email.toLocaleLowerCase(),
    name: input.name.toLocaleLowerCase(),
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
