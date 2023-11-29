import type { GetServerSidePropsContext } from "next";
import { useState } from "react";

import AuthPanel from "~/components/auth/AuthPanel";
import { ApiErrorMessage, Button, Link, SEOHead } from "~/components/core";
import {
  Form,
  InputEmail,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type ForgotPasswordInput, forgotPasswordSchema } from "~/lib/schemas/user.schema";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";
import { api } from "~/utils/api";

const ForgotPassword = () => {
  const form = useForm({ schema: forgotPasswordSchema });
  const [emailSent, setEmailSent] = useState(false);

  const {
    mutate: apiForgotPassword,
    isLoading,
    error: apiError,
  } = api.user.forgotPassword.useMutation({
    onSuccess() {
      setEmailSent(true);
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (values: ForgotPasswordInput) => {
    apiForgotPassword(values);
  };

  return (
    <>
      <SEOHead title="Forgot Password" description="Reset your password" />
      <AuthPanel showLogo heading="Forgot Password">
        {emailSent ? (
          <>
            <p>
              If this email address is registered with us, then we have sent your password reset
              instructions there.
            </p>

            <p>
              If you {"don't"} receive the email within a few minutes, please ensure that the email
              address you entered is correct and check your spam folder. If the issue persists,
              please contact support.
            </p>
          </>
        ) : (
          <>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />
            <Form form={form} handleSubmit={handleSubmit}>
              <fieldset className="space-y-6" disabled={isLoading}>
                <InputEmail label="Email" {...form.register("email")} />

                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!form.formState.isDirty || !form.formState.isValid}>
                  Reset Password
                </Button>

                <div className="text-sm">
                  Remember your password? <Link href="/auth/signin">Sign in</Link>
                </div>
              </fieldset>
            </Form>
          </>
        )}
      </AuthPanel>
    </>
  );
};

export default ForgotPassword;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
