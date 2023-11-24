import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import AuthPanel from "~/components/auth/AuthPanel";
import { Button, Link } from "~/components/core";
import { verifyEmail } from "~/server/services/user.service";

const VerifyEmailToken = ({ status }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    if (status === "valid" && session && !session.user?.emailVerified) {
      update("emailVerified");
    }
  });

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      {status === "valid" ? (
        <AuthPanel showLogo heading="Your email has been verified!">
          {session ? (
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
            {session ? (
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

  const status = await verifyEmail(token);

  return { props: { status } };
}
