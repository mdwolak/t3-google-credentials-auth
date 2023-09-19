import z, { type TypeOf } from "zod";

import {
  optionalStringCleaned,
  preprocessCleanString,
  requiredString,
  requiredStringCleaned,
} from "~/lib/schemas/common.schema";

const ukPostcodeRegex =
  /^(GIR\s?0AA|[A-PR-UWYZ]\d{1,2}(\d{1,2}[A-HJKPSTUW]|[A-HK-Y]\d{1,2}[ABEHMNPRVWXY])?\s?\d[A-Z]{2})$/i;

export const createAddressSchema = z.object({
  line1: requiredStringCleaned,
  line2: optionalStringCleaned,
  city: requiredStringCleaned,
  county: optionalStringCleaned,
  postcode: preprocessCleanString(
    requiredString.regex(ukPostcodeRegex, "Invalid UK postcode").toUpperCase()
  ),
  organisationId: z.number(),
});

export const updateAddressSchema = z.object({
  id: z.number(),
  data: createAddressSchema.partial(),
});

export type CreateAddressInput = TypeOf<typeof createAddressSchema>;
export type UpdateAddressInput = TypeOf<typeof updateAddressSchema>;
