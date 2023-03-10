import { router } from "../trpc";
import { exampleRouter } from "./example";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
