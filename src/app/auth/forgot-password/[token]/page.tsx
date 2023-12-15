import AuthPanel from "~/components/auth/AuthPanel";
import * as verificationTokenService from "~/server/services/auth/verificationToken.service";
import * as userService from "~/server/services/user.service";

import { ResetPassword } from "./reset-password";

export const metadata = {
  title: "Reset Password",
  description: "Reset Password",
};

export default async function ResetPasswordPage({ params }: { params: { token: string } }) {
  const validationResult = await verificationTokenService.validate(params.token);

  const isTokenValid =
    validationResult.status === "valid" &&
    !!(await userService.findUnique({ id: Number(validationResult.identifier) }));

  return (
    //TODO: Include <meta name="robots" content="noindex" />
    <>
      <AuthPanel showLogo heading="Reset Password">
        <ResetPassword isTokenValid={isTokenValid} token={params.token} />
      </AuthPanel>
    </>
  );
}
