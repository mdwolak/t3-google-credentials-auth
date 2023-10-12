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
import { canUpdate2 } from "~/server/services/permission.service";
import * as scheduleDayService from "~/server/services/scheduleDay.service";
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
    await checkUniqueness(input.scheduleId, input.dayOfWeek);

    const scheduleDay = await scheduleDayService.create(getUserId(ctx), input);

    return { scheduleDay };
  }),
  update: protectedProcedure.input(updateScheduleDaySchema).mutation(async ({ input, ctx }) => {
    const dbScheduleDay = await getByIdOrThrow(input.id);

    if (!canUpdate2(ctx, dbScheduleDay.createdById)) throw httpForbidden();

    if (input.data.dayOfWeek && input.data.dayOfWeek !== dbScheduleDay.dayOfWeek) {
      await checkUniqueness(dbScheduleDay.scheduleId, input.data.dayOfWeek);
    }

    const scheduleDay = await scheduleDayService.update(
      getUserId(ctx),
      { id: input.id },
      input.data
    );

    return { scheduleDay };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbScheduleDay = await getByIdOrThrow(input);

    if (!canUpdate2(ctx, dbScheduleDay.createdById)) throw httpForbidden();

    await scheduleDayService.remove({ id: input });
  }),
});

export type ScheduleDayInfo = RouterOutputs["scheduleDay"]["getFiltered"]["scheduleDays"][0];

async function checkUniqueness(scheduleId: number, dayOfWeek: number) {
  if (await scheduleDayService.findUnique({ scheduleId_dayOfWeek: { scheduleId, dayOfWeek } }))
    throw httpConflictWithZod(getZodErrorWithCustomIssue("Already in use", ["dayOfWeek"]));
}

async function getByIdOrThrow(id: number) {
  const scheduleDay = await scheduleDayService.findUnique({ id });
  if (!scheduleDay) throw httpNotFound(entityName);

  return scheduleDay;
}
