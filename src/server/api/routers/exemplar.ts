import { filterQuery, numericId } from "~/lib/schemas/common";
import { createExemplarSchema, updateExemplarSchema } from "~/lib/schemas/exemplar";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  getPrismaUserFromContext as getUser,
  httpConflictWithZod,
  httpForbidden,
  httpNotFound,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import * as exemplarService from "~/server/services/exemplar";
import { defaultExemplarSelect } from "~/server/services/exemplar";
import { canUpdate } from "~/server/services/permission";
import type { RouterOutputs } from "~/utils/api";

const entityName = "Exemplar";

export const exemplarRouter = router({
  /**
   * READ
   */
  getById: publicProcedure.input(numericId).query(async ({ input }) => {
    return await getByIdOrThrow(input);
  }),
  getFiltered: publicProcedure.input(filterQuery).query(async ({ input }) => {
    const exemplars = await exemplarService.findAll(input.page, input.limit);

    return { results: exemplars.length, exemplars };
  }),

  /**
   * WRITE
   */
  create: publicProcedure.input(createExemplarSchema).mutation(async ({ input, ctx }) => {
    await checkUniqueName(input.name);

    const exemplar = await exemplarService.create({ ...input, user: getUser(ctx) });

    return { exemplar };
  }),
  update: protectedProcedure.input(updateExemplarSchema).mutation(async ({ input, ctx }) => {
    const dbExemplar = await getByIdOrThrow(input.id);

    if (!canUpdate(ctx, dbExemplar)) throw httpForbidden();

    if (input.data.name && input.data.name !== dbExemplar.name) {
      await checkUniqueName(input.data.name);
    }

    const exemplar = await exemplarService.update({ id: input.id }, input.data);

    return { exemplar };
  }),
  delete: publicProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbExemplar = await getByIdOrThrow(input);

    if (!canUpdate(ctx, dbExemplar)) throw httpForbidden();

    await exemplarService.remove({ id: input });
  }),
});

export type ExemplarInfo = RouterOutputs["exemplar"]["getFiltered"]["exemplars"][0];

async function checkUniqueName(name: string) {
  if (await exemplarService.findUnique({ name }))
    throw httpConflictWithZod(getZodErrorWithCustomIssue("Already in use", ["name"]));
}

async function getByIdOrThrow(id: number) {
  const exemplar = await exemplarService.findUnique(
    { id: id },
    { ...defaultExemplarSelect, createdBy: true }
  );
  if (!exemplar) throw httpNotFound(entityName);

  return exemplar;
}
