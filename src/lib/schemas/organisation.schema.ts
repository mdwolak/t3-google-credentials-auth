import z, { type TypeOf } from "zod";

import { requiredStringCleaned } from "~/lib/schemas/common.schema";

export const createOrganisationSchema = z.object({
  //parentId: z.number().int().min(1).optional(),
  name: requiredStringCleaned,
  description: requiredStringCleaned,
  //type: nativeEnum(OrganisationType).optional(),
  visible: z.boolean().optional(),
  //status: nativeEnum(ActivityStatus).optional(),
  //position: z.number().int().min(0).optional(),
  //data: jsonSchema,
});

export const updateOrganisationSchema = z.object({
  id: z.number(),
  data: createOrganisationSchema.partial(),
});

export type CreateOrganisationInput = TypeOf<typeof createOrganisationSchema>;
export type UpdateOrganisationInput = TypeOf<typeof updateOrganisationSchema>;
