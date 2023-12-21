import { filterQuery, numericId } from "~/lib/schemas/common.schema";
import { createScheduleSchema, updateScheduleSchema } from "~/lib/schemas/schedule.schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { getUserId, httpForbidden, httpNotFound } from "~/server/api/trpcHelper";
import { canUpdate } from "~/server/services/permission.service";
import * as scheduleService from "~/server/services/schedule.service";
import type { RouterOutputs } from "~/trpc/client";

const entityName = "Schedule";

export const scheduleRouter = createTRPCRouter({
  /**
   * READ
   */
  getById: publicProcedure.input(numericId).query(async ({ input }) => {
    return await getByIdOrThrow(input);
  }),

  getByActivityId: publicProcedure.input(numericId).query(async ({ input }) => {
    const schedules = await scheduleService.findByActivityId(input);

    return { schedules };
  }),

  getFiltered: publicProcedure.input(filterQuery).query(async ({ input }) => {
    const schedules = await scheduleService.findAll(input.page, input.limit);

    return { results: schedules.length, schedules };
  }),

  /**
   * WRITE
   */
  create: protectedProcedure.input(createScheduleSchema).mutation(async ({ input, ctx }) => {
    const schedule = await scheduleService.create(getUserId(ctx), {
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      activity: { connect: { id: input.activityId } },
    });

    return { schedule };
  }),

  update: protectedProcedure.input(updateScheduleSchema).mutation(async ({ input, ctx }) => {
    const dbSchedule = await getByIdOrThrow(input.id);

    if (!canUpdate(ctx.session.user, dbSchedule.createdById)) throw httpForbidden();

    const schedule = await scheduleService.update(getUserId(ctx), { id: input.id }, input.data);

    return { schedule };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbSchedule = await getByIdOrThrow(input);

    if (!canUpdate(ctx.session.user, dbSchedule.createdById)) throw httpForbidden();

    await scheduleService.remove({ id: input });
  }),
});

export type ScheduleInfo = RouterOutputs["schedule"]["getFiltered"]["schedules"][0];

async function getByIdOrThrow(id: number) {
  const schedule = await scheduleService.findUnique({ id: id });
  if (!schedule) throw httpNotFound(entityName);

  return schedule;
}
