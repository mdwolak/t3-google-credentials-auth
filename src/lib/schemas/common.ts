import { number, object, string } from "zod";

export const nonEmptyString = string().trim().min(1, "This field cannot be empty"); //required

export const filterQuery = object({
  limit: number().default(1),
  page: number().default(10),
});

export const numericId = number();
