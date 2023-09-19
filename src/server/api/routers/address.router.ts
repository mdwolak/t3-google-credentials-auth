import { createAddressSchema, updateAddressSchema } from "~/lib/schemas/address.schema";
import { filterQueryWithOrg, numericId } from "~/lib/schemas/common.schema";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  getUserId,
  httpConflictWithZod,
  httpForbidden,
  httpNotFound,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import * as addressService from "~/server/services/address.service";
import { defaultAddressSelect } from "~/server/services/address.service";
import { canUpdate } from "~/server/services/permission.service";
import type { RouterOutputs } from "~/utils/api";

const entityName = "Address";

export const addressRouter = router({
  /**
   * READ
   */
  getById: publicProcedure.input(numericId).query(async ({ input }) => {
    return await getByIdOrThrow(input);
  }),
  getFiltered: publicProcedure.input(filterQueryWithOrg).query(async ({ input }) => {
    const addresses = await addressService.findAll(input.organisationId, input.page, input.limit);

    return { results: addresses.length, addresses };
  }),

  /**
   * WRITE
   */
  create: protectedProcedure.input(createAddressSchema).mutation(async ({ input, ctx }) => {
    await checkUniqueness(input.line1, input.postcode);

    const address = await addressService.create(getUserId(ctx), input);

    return { address };
  }),
  update: protectedProcedure.input(updateAddressSchema).mutation(async ({ input, ctx }) => {
    const dbAddress = await getByIdOrThrow(input.id);

    if (!canUpdate(ctx, dbAddress, "createdById")) throw httpForbidden();

    if (
      (input.data.line1 && input.data.line1 !== dbAddress.line1) ||
      (input.data.postcode && input.data.postcode !== dbAddress.postcode)
    ) {
      await checkUniqueness(
        input.data.line1 ?? (dbAddress.line1 as string),
        input.data.postcode ?? (dbAddress.postcode as string)
      );
    }

    const address = await addressService.update(getUserId(ctx), { id: input.id }, input.data);

    return { address };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbAddress = await getByIdOrThrow(input);

    if (!canUpdate(ctx, dbAddress, "createdById")) throw httpForbidden();

    await addressService.remove({ id: input });
  }),
});

export type AddressInfo = RouterOutputs["address"]["getFiltered"]["addresses"][0];

async function checkUniqueness(line1: string, postcode: string) {
  const address = await addressService.findFirst({ line1, postcode });
  if (address)
    throw httpConflictWithZod(getZodErrorWithCustomIssue("Already in use", ["line1", "postcode"]));
}

async function getByIdOrThrow(id: number) {
  const address = await addressService.findUnique(
    { id: id },
    { ...defaultAddressSelect, createdById: true }
  );
  if (!address) throw httpNotFound(entityName);

  return address;
}
