//source https://github.com/lucia-auth/examples/blob/main/nextjs-app/email-and-password/auth/token.ts
import crypto from "crypto";
import dayjs from "dayjs";

import { prisma } from "~/server/db";

const generateToken = (length: number): string => {
  const token = crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
  return token.slice(0, length);
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generate = async (identifier: string, expires: Date) => {
  // const storedUserTokens = await prisma
  // 	.selectFrom("email_verification_token")
  // 	.selectAll()
  // 	.where("user_id", "=", identifier)
  // 	.execute();
  // if (storedUserTokens.length > 0) {
  // 	const reusableStoredToken = storedUserTokens.find((token) => {
  // 		// check if expiration is within 1 hour
  // 		// and reuse the token if true
  // 		return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
  // 	});
  // 	if (reusableStoredToken) return reusableStoredToken.id;
  // }
  //IMPROVE: ratelimit using redis
  const token = generateToken(32);

  await prisma.verificationToken.create({
    data: {
      identifier, //TODO: consider formats e.g. identifier: `invite-link-for-teamId-${teamId}`,
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
    //TODO: return null. client should throw token is invalid or has expired
    //       expires: {
    //   gt: new Date(),
    // },
  });
  if (!verificationToken) {
    return null;
  }

  if (deleteToken) {
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

    if (dayjs(verificationToken.expires).isBefore(dayjs())) {
      return null;
    }
    return verificationToken.identifier;
  }
};
