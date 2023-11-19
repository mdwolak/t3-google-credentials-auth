import { ErrorCode } from "~/lib/errorCodes";
import * as userService from "~/server/services/user.service";

export async function authorize(credentials: { email: string; password: string }) {
  const dbUser = await userService.findUniqueSensitive({
    email: credentials.email.toLowerCase(),
  });

  if (
    !dbUser ||
    !dbUser.password ||
    !(await userService.verifyPassword(credentials.password, dbUser.password))
  )
    throw new Error(ErrorCode.InvalidEmailOrPassword);

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    orgId: dbUser.orgId,
  };
}
