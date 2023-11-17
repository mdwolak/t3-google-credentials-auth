import bcrypt from "bcryptjs";

import { ErrorCode } from "~/lib/errorCodes";
import * as userService from "~/server/services/user.service";

export async function authorize(credentials: { email: string; password: string }) {
  const user = await userService.findUniqueSensitive({
    email: credentials.email.toLowerCase(),
  });

  if (!user || !user.password || !(await bcrypt.compare(credentials.password, user.password)))
    throw new Error(ErrorCode.InvalidEmailOrPassword);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    orgId: user.orgId,
  };
}
