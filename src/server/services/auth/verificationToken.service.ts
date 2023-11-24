//source https://github.com/lucia-auth/examples/blob/main/nextjs-app/email-and-password/auth/token.ts
import { type TokenType } from "@prisma/client";
import crypto from "crypto";
import dayjs from "dayjs";

import { prisma } from "~/server/db";

/*
REMARKS:
  - Only one (the latest) token per user can be valid at a time
  - Tokens must be deleted after use
*/

export const generate = async (identifier: string, expires: Date, type: TokenType) => {
  if (dayjs(expires).isBefore(dayjs())) throw new Error("Token expires in the past");

  //IMPROVE: ratelimit using redis

  //invalidate all previous tokens of the specified type by setting their expiry to the past
  await prisma.verificationToken.updateMany({
    where: { identifier, expires: { gt: new Date() }, type },
    data: { expires: new Date() },
  });

  const token = generateToken(64);

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashToken(token),
      expires,
      type,
    },
  });

  return token;
};

type ValidateTokenOutput = {
  status: "valid" | "invalid" | "expired";
  identifier?: string;
};
export const validate = async (
  token: string,
  deleteToken = false
): Promise<ValidateTokenOutput> => {
  const hashedToken = hashToken(token);
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token: hashedToken },
  });
  if (!verificationToken) {
    return { status: "invalid" };
  }

  if (deleteToken)
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

  if (dayjs(verificationToken.expires).isBefore(dayjs())) {
    return { status: "expired" };
  }
  return { status: "valid", identifier: verificationToken.identifier };
};

const generateToken = (length: number): string => {
  const token = crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
  return token.slice(0, length);
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
