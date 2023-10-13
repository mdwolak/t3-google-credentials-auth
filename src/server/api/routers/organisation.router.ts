import { filterQuery, numericId } from "~/lib/schemas/common.schema";
import {
  createOrganisationSchema,
  updateOrganisationSchema,
} from "~/lib/schemas/organisation.schema";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  getUserId,
  httpConflictWithZod,
  httpForbidden,
  httpNotFound,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import * as organisationService from "~/server/services/organisation.service";
import { defaultOrganisationSelect } from "~/server/services/organisation.service";
import { canUpdate } from "~/server/services/permission.service";
import type { RouterOutputs } from "~/utils/api";

const entityName = "Organisation";

export const organisationRouter = router({
  /**
   * READ
   */
  getById: publicProcedure.input(numericId).query(async ({ input }) => {
    return await getByIdOrThrow(input);
  }),
  getFiltered: publicProcedure.input(filterQuery).query(async ({ input }) => {
    const organisations = await organisationService.findAll(input.page, input.limit);

    return { results: organisations.length, organisations };
  }),

  /**
   * WRITE
   */
  create: protectedProcedure.input(createOrganisationSchema).mutation(async ({ input, ctx }) => {
    await checkUniqueName(input.name);

    const organisation = await organisationService.create(getUserId(ctx), input);

    return { organisation };
  }),
  update: protectedProcedure.input(updateOrganisationSchema).mutation(async ({ input, ctx }) => {
    const dbOrganisation = await getByIdOrThrow(input.id);

    if (!canUpdate(ctx, dbOrganisation.createdById)) throw httpForbidden();

    if (input.data.name && input.data.name !== dbOrganisation.name) {
      await checkUniqueName(input.data.name);
    }

    const organisation = await organisationService.update(
      getUserId(ctx),
      { id: input.id },
      input.data
    );

    return { organisation };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbOrganisation = await getByIdOrThrow(input);

    if (!canUpdate(ctx, dbOrganisation.createdById)) throw httpForbidden();

    await organisationService.remove({ id: input });
  }),
});

export type OrganisationInfo = RouterOutputs["organisation"]["getFiltered"]["organisations"][0];

async function checkUniqueName(name: string) {
  if (await organisationService.findFirst({ name }))
    throw httpConflictWithZod(getZodErrorWithCustomIssue("Already in use", ["name"]));
}

async function getByIdOrThrow(id: number) {
  const organisation = await organisationService.findUnique(
    { id: id },
    { ...defaultOrganisationSelect, createdById: true }
  );
  if (!organisation) throw httpNotFound(entityName);

  return organisation;
}
