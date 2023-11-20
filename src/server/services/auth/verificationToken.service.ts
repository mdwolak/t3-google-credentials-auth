//source https://github.com/lucia-auth/examples/blob/main/nextjs-app/email-and-password/auth/token.ts
import crypto from "crypto";
import dayjs from "dayjs";

import { prisma } from "~/server/db";

export const generate = async (identifier: string, expires: Date) => {
  //IMPROVE: ratelimit using redis
  const token = generateToken(32);

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashToken(token),
      expires,
    },
  });

  return token;
};

export const validate = async (token: string, deleteToken = false) => {
  const hashedToken = hashToken(token);
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token: hashedToken },
  });
  if (!verificationToken) {
    return null;
  }

  if (deleteToken)
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

  if (dayjs(verificationToken.expires).isBefore(dayjs())) {
    return null;
  }
  return verificationToken.identifier;
};

const generateToken = (length: number): string => {
  const token = crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
  return token.slice(0, length);
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
