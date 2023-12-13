import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  //Here you can handle or change errors
  // @see https://trpc.io/docs/server/error-handling#handling-errors
  onError:
    env.NODE_ENV === "development"
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ error, path, input, ctx, type, req }) => {
          console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
        }
      : undefined,
});
