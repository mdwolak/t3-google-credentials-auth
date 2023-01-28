import { type Session } from "next-auth";

import { createContextInner } from "~/server/trpc/context";
import { appRouter } from "~/server/trpc/router/_app";

/** A convenience method to call tRPC queries */
/**
 * Pass user details when testing a protected procedure
 * @link https://create.t3.gg/en/usage/trpc#sample-integration-test
 * @link https://trpc.io/docs/server-side-calls#create-caller
 **/
export const trpcRequest = async (user?: Session["user"]) => {
  const ctx = await createContextInner({
    session: {
      user,
      expires: "",
    },
  });
  return appRouter.createCaller(ctx);
};
