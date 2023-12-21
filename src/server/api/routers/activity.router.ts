import { ActivityStatus } from "@prisma/client";
import slugify from "slugify";

import { createActivitySchema, updateActivitySchema } from "~/lib/schemas/activity.schema";
import { filterQueryWithOrg, numericId } from "~/lib/schemas/common.schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  getUserId,
  httpConflictWithZod,
  httpForbidden,
  httpNotFound,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import * as activityService from "~/server/services/activity.service";
import { canUpdate } from "~/server/services/permission.service";
import type { RouterOutputs } from "~/trpc/client";

const entityName = "Activity";

export const activityRouter = createTRPCRouter({
  /**
   * READ
   */
  getById: publicProcedure.input(numericId).query(async ({ input }) => {
    return await getByIdOrThrow(input);
  }),
  getFiltered: protectedProcedure.input(filterQueryWithOrg).query(async ({ input }) => {
    const activities = await activityService.findAll(input.orgId, input.page, input.limit);

    return { results: activities.length, activities };
  }),

  /**
   * WRITE
   */
  create: protectedProcedure.input(createActivitySchema).mutation(async ({ input, ctx }) => {
    await checkUniqueness(input.orgId, input.name, ActivityStatus.Draft);

    const slug = slugify(input.name);
    const activity = await activityService.create(getUserId(ctx), {
      ...input,
      slug,
      //TODO: use checked input
      //organisation: { connect: { id: input.orgId } },
    });

    return { activity };
  }),
  update: protectedProcedure.input(updateActivitySchema).mutation(async ({ input, ctx }) => {
    let slug = "";
    const dbActivity = await getByIdOrThrow(input.id);

    if (!canUpdate(ctx.session.user, dbActivity.createdById)) throw httpForbidden();

    if (input.data.name && input.data.name !== dbActivity.name) {
      await checkUniqueness(dbActivity.orgId, input.data.name, dbActivity.status);
      slug = slugify(input.data.name);
    }

    const activity = await activityService.update(
      getUserId(ctx),
      { id: input.id },
      { ...input.data, ...(slug ? { slug } : {}) },
    );

    return { activity };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbActivity = await getByIdOrThrow(input);

    if (!canUpdate(ctx.session.user, dbActivity.createdById)) throw httpForbidden();

    await activityService.remove({ id: input });
  }),
});

export type ActivityInfo = RouterOutputs["activity"]["getFiltered"]["activities"][0];

async function checkUniqueness(orgId: number, name: string, status: ActivityStatus) {
  if (await activityService.findUnique({ orgId_name_status: { orgId, name, status } }))
    throw httpConflictWithZod(
      getZodErrorWithCustomIssue("Activity with the same name and status already exists", ["name"]),
    );
}

async function getByIdOrThrow(id: number) {
  const activity = await activityService.findUnique({ id: id });
  if (!activity) throw httpNotFound(entityName);

  return activity;
}
