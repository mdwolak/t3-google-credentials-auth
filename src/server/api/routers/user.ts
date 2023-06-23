import bcrypt from "bcryptjs";

import { type CreateUserInput, createUserSchema } from "~/lib/schemas/user";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  type ErrorHandlerOptions,
  genericErrorHandler,
  handleRequest,
  httpConflict,
} from "~/server/api/trpcHelper";
import * as userService from "~/server/services/user";

const errorHandler = (error: unknown) => {
  const errorHandlerOptions: ErrorHandlerOptions = {
    entityName: "User",
    // dbFieldMappings: {
    //   content: "Content Label",
    //   category: "Category Label",
    // },
  };

  genericErrorHandler(error, errorHandlerOptions);
};

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
  handleRequest(async () => {
    let user = await userService.findUnique({ email: input.email.toLowerCase() });
    if (user) {
      throw httpConflict("Email already taken");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    user = await userService.create({
      email: input.email.toLocaleLowerCase(),
      name: input.name.toLocaleLowerCase(),
      password: hashedPassword,
      //TODO: introduce provider enum
      //provider: "local",
    });
  }, errorHandler);
};
