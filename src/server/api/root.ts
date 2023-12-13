import { activityRouter } from "~/server/api/routers/activity.router";
import { addressRouter } from "~/server/api/routers/address.router";
import { exampleRouter } from "~/server/api/routers/example.router";
import { exemplarRouter } from "~/server/api/routers/exemplar.router";
import { organisationRouter } from "~/server/api/routers/organisation.router";
import { scheduleRouter } from "~/server/api/routers/schedule.router";
import { scheduleDayRouter } from "~/server/api/routers/scheduleDay.router";
import { userRouter } from "~/server/api/routers/user.router";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  activity: activityRouter,
  address: addressRouter,
  example: exampleRouter,
  exemplar: exemplarRouter,
  organisation: organisationRouter,
  schedule: scheduleRouter,
  scheduleDay: scheduleDayRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
