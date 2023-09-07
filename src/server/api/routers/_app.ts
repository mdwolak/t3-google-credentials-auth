import { router } from "../trpc";
import { activityRouter } from "./activity.router";
import { addressRouter } from "./address.router";
import { exampleRouter } from "./example.router";
import { exemplarRouter } from "./exemplar.router";
import { scheduleRouter } from "./schedule.router";
import { userRouter } from "./user.router";

export const appRouter = router({
  activity: activityRouter,
  address: addressRouter,
  example: exampleRouter,
  exemplar: exemplarRouter,
  schedule: scheduleRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
