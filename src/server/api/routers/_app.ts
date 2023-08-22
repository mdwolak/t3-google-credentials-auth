import { router } from "../trpc";
import { activityRouter } from "./activity";
import { addressRouter } from "./address";
import { exampleRouter } from "./example";
import { exemplarRouter } from "./exemplar";
import { userRouter } from "./user";

export const appRouter = router({
  activity: activityRouter,
  address: addressRouter,
  example: exampleRouter,
  exemplar: exemplarRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
