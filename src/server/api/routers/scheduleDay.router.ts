import { filterQuery, numericId } from "~/lib/schemas/common.schema";
import { createScheduleDaySchema, updateScheduleDaySchema } from "~/lib/schemas/scheduleDay.schema";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  getUserId,
  httpConflictWithZod,
  httpForbidden,
  httpNotFound,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import { canUpdate } from "~/server/services/permission.service";
import * as scheduleDayService from "~/server/services/scheduleDay.service";
import { defaultScheduleDaySelect } from "~/server/services/scheduleDay.service";
import type { RouterOutputs } from "~/utils/api";

const entityName = "ScheduleDay";

export const scheduleDayRouter = router({
  /**
   * READ
   */
  getById: publicProcedure.input(numericId).query(async ({ input }) => {
    return await getByIdOrThrow(input);
  }),

  //TODO: remove
  getByScheduleId: publicProcedure.input(numericId).query(async ({ input }) => {
    const scheduleDays = await scheduleDayService.findByScheduleId(input);

    return { scheduleDays: scheduleDays };
  }),

  getFiltered: publicProcedure.input(filterQuery).query(async ({ input }) => {
    const scheduleDays = await scheduleDayService.findAll(input.page, input.limit);

    return { results: scheduleDays.length, scheduleDays };
  }),

  /**
   * WRITE
   */
  create: protectedProcedure.input(createScheduleDaySchema).mutation(async ({ input, ctx }) => {
    //await checkUniqueName(input.name);
    const scheduleDay = await scheduleDayService.create(getUserId(ctx), input);

    return { scheduleDay };
  }),
  update: protectedProcedure.input(updateScheduleDaySchema).mutation(async ({ input, ctx }) => {
    //const dbScheduleDay = await getByIdOrThrow(input.id);

    // if (!canUpdate(ctx, dbScheduleDay, "createdById")) throw httpForbidden();

    // if (input.data.name && input.data.name !== dbScheduleDay.name) {
    //   await checkUniqueName(input.data.name);
    // }

    const scheduleDay = await scheduleDayService.update(
      getUserId(ctx),
      { id: input.id },
      input.data
    );

    return { scheduleDay };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    //const dbScheduleDay = await getByIdOrThrow(input);

    //if (!canUpdate(ctx, dbScheduleDay, "createdById")) throw httpForbidden();

    await scheduleDayService.remove({ id: input });
  }),
});

export type ScheduleDayInfo = RouterOutputs["scheduleDay"]["getFiltered"]["scheduleDays"][0];

// async function checkUniqueName(name: string) {
//   if (await scheduleDayService.findFirst({ name }))
//     throw httpConflictWithZod(getZodErrorWithCustomIssue("Already in use", ["name"]));
// }

async function getByIdOrThrow(id: number) {
  const scheduleDay = await scheduleDayService.findUnique(
    { id: id },
    { ...defaultScheduleDaySelect }
  );
  if (!scheduleDay) throw httpNotFound(entityName);

  return scheduleDay;
}
