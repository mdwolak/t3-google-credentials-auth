import z, { type TypeOf } from "zod";

import { duration, requiredStringCleaned } from "~/lib/schemas/common.schema";

export const createActivitySchema = z.object({
  name: requiredStringCleaned,
  description: requiredStringCleaned,
  //type: z.number().int(),
  addressId: z.number().int().min(1),
  orgId: z.number(),
  duration: duration,
  //slug: requiredStringCleaned,
  visible: z.boolean().optional(),
  //status: nativeEnum(ActivityStatus).optional(),
  //data: jsonSchema,
});

export const updateActivitySchema = z.object({
  id: z.number(),
  data: createActivitySchema.omit({ orgId: true }).partial(),
});

export type CreateActivityInput = TypeOf<typeof createActivitySchema>;
export type UpdateActivityInput = TypeOf<typeof updateActivitySchema>;
