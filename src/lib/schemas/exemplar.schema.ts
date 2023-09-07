import z, { type TypeOf } from "zod";

import { requiredStringCleaned } from "~/lib/schemas/common.schema";

export const createExemplarSchema = z.object({
  name: requiredStringCleaned,
  category: requiredStringCleaned,
  content: requiredStringCleaned,
  published: z.boolean({
    required_error: "Published is required",
  }),
});

export const updateExemplarSchema = z.object({
  id: z.number(),
  data: createExemplarSchema.partial(),
});

export type CreateExemplarInput = TypeOf<typeof createExemplarSchema>;
export type UpdateExemplarInput = TypeOf<typeof updateExemplarSchema>;
