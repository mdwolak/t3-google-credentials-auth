//source https://github.com/lucia-auth/examples/blob/main/nextjs-app/email-and-password/auth/token.ts
import crypto from "crypto";
import dayjs from "dayjs";

import { prisma } from "~/server/db";

export const generateVerificationToken = async (identifier: string, expires: Date) => {
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

export const validateVerificationToken = async (token: string) => {
  const hashedToken = hashToken(token);
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token: hashedToken },
  });
  if (!verificationToken) {
    throw new Error("Invalid token");
  }
  //lucia advise to delete token

  if (dayjs(verificationToken.expires).isBefore(dayjs())) {
    throw new Error("Expired token");
  }
  return verificationToken.identifier;
};

// export const isValidPasswordResetToken = async (token: string) => {
//   const storedToken = await db
//     .selectFrom("password_reset_token")
//     .selectAll()
//     .where("id", "=", token)
//     .executeTakeFirst();
//   if (!storedToken) return false;
//   const tokenExpires = Number(storedToken.expires); // bigint => number conversion
//   if (!isWithinExpiration(tokenExpires)) {
//     return false;
//   }
//   return true;
// };

const generateToken = (length: number): string => {
  const token = crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
  return token.slice(0, length);
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
