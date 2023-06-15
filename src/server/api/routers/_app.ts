import { router } from "../trpc";
import { exampleRouter } from "./example";
import { exemplarRouter } from "./exemplar";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  user: userRouter,
  exemplar: exemplarRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
