import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import AuthPanel from "~/components/auth/AuthPanel";
import { Link } from "~/components/core";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";
import * as verificationTokenService from "~/server/services/auth/verificationToken.service";
import * as userService from "~/server/services/user.service";

const VerifyEmailToken = ({
  hasSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <AuthPanel showLogo heading="E-mail verification failed">
        <p>The email verification link has expired.</p>
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
    </>
  );
};

export default VerifyEmailToken;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.params?.token as string;

  const userId = await verificationTokenService.validate(token, true);

  //TODO: check if e-mail already verified. If yes, check if user has been onboarded or not.
  const isTokenValid = !!userId && !!(await userService.findUnique({ id: Number(userId) }));
  if (isTokenValid) {
    await userService.update({ id: Number(userId) }, { emailVerified: new Date() });
    return { redirect: { destination: "/getting-started", permanent: false } };
  }

  const session = await getServerAuthSession(context);
  // if (session) {
  //   return {
  //     redirect: {
  //       destination: "/auth/verify-email?status=tokenExpired",
  //       permanent: false,
  //     },
  //   };
  // }

  return { props: { hasSession: !!session } };
}
