import z, { type TypeOf } from "zod";

import { optionalStringCleaned } from "~/lib/schemas/common.schema";

export const createScheduleSchema = z.object({
  name: optionalStringCleaned,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  activityId: z.coerce.number(),
  //scheduleDays: z.array(ScheduleDay),
});

export const updateScheduleSchema = z.object({
  id: z.number(),
  data: createScheduleSchema.omit({ activityId: true }).partial(),
});

export type CreateScheduleInput = TypeOf<typeof createScheduleSchema>;
export type UpdateScheduleInput = TypeOf<typeof updateScheduleSchema>;
