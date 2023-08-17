import type { TypeOf } from "zod";
import { number, object, string, z } from "zod";

import {
  optionalStringCleaned,
  preprocessCleanString,
  requiredString,
  requiredStringCleaned,
} from "./common";

const ukPostcodeRegex =
  /^(GIR\s?0AA|[A-PR-UWYZ]\d{1,2}(\d{1,2}[A-HJKPSTUW]|[A-HK-Y]\d{1,2}[ABEHMNPRVWXY])?\s?\d[A-Z]{2})$/i;

export const createAddressSchema = object({
  line1: requiredStringCleaned,
  line2: optionalStringCleaned,
  city: requiredStringCleaned,
  county: optionalStringCleaned,
  postcode: preprocessCleanString(
    requiredString.regex(ukPostcodeRegex, "Invalid UK postcode").toUpperCase()
  ),
});

export const updateAddressSchema = object({
  id: number(),
  data: createAddressSchema.partial(),
});

export type CreateAddressInput = TypeOf<typeof createAddressSchema>;
export type UpdateAddressInput = TypeOf<typeof updateAddressSchema>;
