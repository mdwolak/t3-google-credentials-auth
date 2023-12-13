import { createAddressSchema, updateAddressSchema } from "~/lib/schemas/address.schema";
import { filterQueryWithOrg, numericId } from "~/lib/schemas/common.schema";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import { getUserId, httpForbidden, httpNotFound } from "~/server/api/trpcHelper";
import * as addressService from "~/server/services/address.service";
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
    const addresses = await addressService.findAll(input.orgId, input.page, input.limit);

    return { results: addresses.length, addresses };
  }),

  /**
   * WRITE
   */
  create: protectedProcedure.input(createAddressSchema).mutation(async ({ input, ctx }) => {
    const address = await addressService.create(getUserId(ctx), input);

    return { address };
  }),
  update: protectedProcedure.input(updateAddressSchema).mutation(async ({ input, ctx }) => {
    const dbAddress = await getByIdOrThrow(input.id);

    if (!canUpdate(ctx, dbAddress.createdById)) throw httpForbidden();

    const address = await addressService.update(getUserId(ctx), { id: input.id }, input.data);

    return { address };
  }),
  delete: protectedProcedure.input(numericId).mutation(async ({ input, ctx }) => {
    const dbAddress = await getByIdOrThrow(input);

    if (!canUpdate(ctx, dbAddress.createdById)) throw httpForbidden();

    await addressService.remove({ id: input });
  }),
});

export type AddressInfo = RouterOutputs["address"]["getFiltered"]["addresses"][0];

async function getByIdOrThrow(id: number) {
  const address = await addressService.findUnique({ id: id });
  if (!address) throw httpNotFound(entityName);

  return address;
}
