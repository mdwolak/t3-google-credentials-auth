import z, { type TypeOf } from "zod";

import { hoursWithMinutes } from "../common";

export const createScheduleDaySchema = z.object({
  dayOfWeek: z.number().int().min(1).max(7),
  startTime: hoursWithMinutes,
  duration: z.number().int().min(1).max(1440),
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
