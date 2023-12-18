import { redirect } from "next/navigation";

import { EmailVerified } from "~/app/(public)/verify-email/[token]/email-verified";
import AuthPanel from "~/components/auth/AuthPanel";
import { Link } from "~/components/core";
import { getServerAuthSession } from "~/server/auth";
import { verifyEmail } from "~/server/services/user.service";

export default async function VerifyEmailTokenPage({ params }: { params: { token: string } }) {
  const session = await getServerAuthSession();
  if (session?.user?.emailVerified) {
    redirect("/getting-started");
  }

  const status = await verifyEmail(params.token);

  return (
    //TODO: Set <meta name="robots" content="noindex" />
    <>
      {status === "valid" ? (
        <EmailVerified />
      ) : (
        //fallback: token expired / invalid (used) / user not found
        <AuthPanel showLogo heading="E-mail verification failed">
          <p>
            {status === "invalid"
              ? "The email verification link is invalid."
              : "The email verification link has expired."}
          </p>
          <p>
            {session ? (
              <>
                <Link href="/verify-email">Request a new verification link</Link>.
              </>
            ) : (
              <>
                <Link href="/auth/signin">Sign in</Link> to request a new verification link.
              </>
            )}
          </p>
        </AuthPanel>
      )}
    </>
  );
}
