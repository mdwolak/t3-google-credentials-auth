import z, { type TypeOf } from "zod";

import { duration, hoursWithMinutes } from "~/lib/schemas/common.schema";

export const createScheduleDaySchema = z.object({
  dayOfWeek: z.number().int().min(1).max(7),
  startTime: hoursWithMinutes,
  duration: duration,
  scheduleId: z.number().int().positive(),

  // duration: z
  // .string()
  // .optional()
  // .transform((val) => val && parseInt(val)),
});

export const updateScheduleDaySchema = z.object({
  id: z.number(),
  data: createScheduleDaySchema.partial(),
});

export type CreateScheduleDayInput = TypeOf<typeof createScheduleDaySchema>;
export type UpdateScheduleDayInput = TypeOf<typeof updateScheduleDaySchema>;
