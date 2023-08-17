import type { TypeOf } from "zod";
import { boolean, number, object } from "zod";

import { requiredStringCleaned } from "./common";

export const createExemplarSchema = object({
  name: requiredStringCleaned,
  category: requiredStringCleaned,
  content: requiredStringCleaned,
  published: boolean({
    required_error: "Published is required",
  }),
});

export const updateExemplarSchema = object({
  id: number(),
  data: createExemplarSchema.partial(),
});

export type CreateExemplarInput = TypeOf<typeof createExemplarSchema>;
export type UpdateExemplarInput = TypeOf<typeof updateExemplarSchema>;
