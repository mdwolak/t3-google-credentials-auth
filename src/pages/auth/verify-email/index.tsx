import type { GetServerSidePropsContext } from "next";
import { useState } from "react";

import AuthPanel from "~/components/auth/AuthPanel";
import { ApiErrorMessage, Button, Link, SEOHead, toast } from "~/components/core";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";
import { api } from "~/utils/api";

//Entry point: logged in user whose email is not verified will be redirected to this page
const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"SendEmail" | "EmailSent" | "ProblemsReceivingEmail">(
    "SendEmail"
  );

  const {
    data,
    mutate: sendVerificationEmail,
    isLoading,
    error: apiError,
  } = api.user.sendVerificationEmail.useMutation({
    onSuccess() {
      setStatus("EmailSent");
      toast.success("Verification email has been resent.");
    },
  });

  return (
    <>
      <SEOHead title="Verify Email" description="Verify your email address" />
      <AuthPanel showLogo heading="???">
        <ApiErrorMessage error={apiError} visible={!!apiError} />
        <div className="text-center">
          {status === "SendEmail" ? (
            <>
              <h1>Verify your email to keep your account secure</h1>
              <p>
                Verifying your email address helps you to safely recover your password, retrieve and
                protect your account, and receive secure messages from us.
              </p>
              <Button onClick={() => sendVerificationEmail()} disabled={isLoading}>
                Send verification email
              </Button>
            </>
          ) : status === "EmailSent" ? (
            <>
              <p>
                An email has been sent to {data?.email}. Please check your inbox and follow the
                instructions to verify your email address.
              </p>
              <p>
                <Link href="#" onClick={() => setStatus("ProblemsReceivingEmail")}>
                  {"Didn't receive the email?"}
                </Link>
              </p>
            </>
          ) : (
            //ProblemsReceivingEmail
            <>
              <h1>{"I didn't receive the email"}</h1>
              <ul>
                <li>Make sure you’ve entered your email address correctly.</li>
                <li>Check your spam folder to make sure our email didn’t end up there.</li>
                <li>{`If you still can't find the email, please use the "Resend verification email" button.`}</li>
                {/* <li>If you continue to experience difficulties, additional options can be <a>found here.</a></li> */}
              </ul>
              Email address: <strong>{data?.email}</strong>
              <Button onClick={() => sendVerificationEmail()} disabled={isLoading} fullWidth>
                Resend verification email
              </Button>
              <Button
                onClick={() => setStatus("EmailSent")}
                disabled={isLoading}
                variant="secondary"
                fullWidth>
                Back
              </Button>
            </>
          )}
        </div>
      </AuthPanel>
    </>
  );
};

export default VerifyEmailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (session.user?.emailVerified) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
