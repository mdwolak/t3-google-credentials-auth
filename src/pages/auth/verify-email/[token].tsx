import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import AuthPanel from "~/components/auth/AuthPanel";
import { Button, Link } from "~/components/core";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";
import * as verificationTokenService from "~/server/services/auth/verificationToken.service";
import * as userService from "~/server/services/user.service";

const VerifyEmailToken = ({
  hasSession,
  status,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      {status === "valid" ? (
        <AuthPanel showLogo heading="Your email has been verified!">
          {hasSession ? (
            <Button onClick={() => router.push("/getting-started")}>Continue</Button>
          ) : (
            <Button onClick={() => router.push("/auth/signin")}>Sign in</Button>
          )}
        </AuthPanel>
      ) : (
        //fallback: token expired / invalid (used) / user not found
        <AuthPanel showLogo heading="E-mail verification failed">
          <p>
            {status === "invalid"
              ? "The email verification link is invalid."
              : "The email verification link has expired."}
          </p>
          <p>
            {hasSession ? (
              <>
                <Link href="/auth/verify-email">Request a new verification link</Link>.
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
};

export default VerifyEmailToken;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.params?.token as string;

  const validationResult = await verificationTokenService.validate(token, true);
  if (validationResult.status === "valid") {
    const user = await userService.findUnique({ id: Number(validationResult.identifier) });

    if (!user) {
      //old link of a deleted user
      return { notFound: true };
    }
    if (!user.emailVerified)
      await userService.update({ id: user.id }, { emailVerified: new Date() });
  }

  const session = await getServerAuthSession(context);

  return { props: { hasSession: !!session, status: validationResult.status } };
}
