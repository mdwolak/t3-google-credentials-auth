import z, { type TypeOf } from "zod";

import { requiredStringCleaned } from "~/lib/schemas/common.schema";

export const createActivitySchema = z.object({
  name: requiredStringCleaned,
  description: requiredStringCleaned,
  //type: z.number().int(),
  addressId: z.number().int().min(1),
  organisationId: z.number(),
  duration: z.number().int().min(1).max(600), //TODO: between
  //slug: requiredStringCleaned,
  visible: z.boolean().optional(),
  //status: nativeEnum(ActivityStatus).optional(),
  //data: jsonSchema,
});

export const updateActivitySchema = z.object({
  id: z.number(),
  data: createActivitySchema.partial(),
});

export type CreateActivityInput = TypeOf<typeof createActivitySchema>;
export type UpdateActivityInput = TypeOf<typeof updateActivitySchema>;
