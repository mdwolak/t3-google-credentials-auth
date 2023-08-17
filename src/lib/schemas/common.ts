import { type ZodString, number, object, preprocess, string } from "zod";

export const cleanString = (value: unknown): unknown =>
  typeof value !== "string" ? value : value.replace(/\s\s+/g, " ").trim();

//cleans string before validation
export const preprocessCleanString = (schema: ZodString) => preprocess(cleanString, schema);
// usage:   postcode: preprocessCleanString(nonEmptyString.regex(ukPostcodeRegex, "Invalid UK postcode").toUpperCase())

export const requiredString = string().trim().min(1, "This field cannot be empty"); //required
export const requiredStringCleaned = requiredString.transform(cleanString);

export const optionalStringCleaned = string().transform(cleanString);

export const filterQuery = object({
  limit: number().default(1),
  page: number().default(10),
});

export const numericId = number();
