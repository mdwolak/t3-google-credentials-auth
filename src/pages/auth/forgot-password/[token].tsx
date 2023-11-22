import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";

import AuthPanel from "~/components/auth/AuthPanel";
import { ApiErrorMessage, Button, Link, SEOHead, toast } from "~/components/core";
import { Form, Input, InputPassword, ValidationSummary, useForm } from "~/components/forms";
import { type ResetPasswordInput, resetPasswordSchema } from "~/lib/schemas/user.schema";
import * as verificationTokenService from "~/server/services/auth/verificationToken.service";
import * as userService from "~/server/services/user.service";
import { api } from "~/utils/api";

//Entry point: user clicks on password reset link in email
const ResetPassword = ({
  isTokenValid,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [status, setStatus] = useState<"enterPassword" | "tokenExpired" | "successfulReset">(
    isTokenValid ? "enterPassword" : "tokenExpired"
  );

  const form = useForm({
    schema: resetPasswordSchema,
    defaultValues: {
      token,
    },
  });

  const {
    mutate: apiResetPassword,
    isLoading,
    error: apiError,
  } = api.user.resetPassword.useMutation({
    onSuccess() {
      setStatus("successfulReset");
    },
    onError(error) {
      //TODO: handle 400 error

      if (error.data?.httpStatus === 400) setStatus("tokenExpired");
      else toast.error(error.message);
    },
  });

  const handleSubmit = (values: ResetPasswordInput) => {
    apiResetPassword(values);
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <AuthPanel showLogo heading="Password Reset">
        {status === "enterPassword" ? (
          <>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />
            <Form form={form} handleSubmit={handleSubmit}>
              <fieldset className="space-y-6" disabled={isLoading}>
                <Input type="hidden" {...form.register("token")} />
                <InputPassword
                  label="New Password"
                  {...form.register("password")}
                  autoComplete="new-password"
                />

                {/* <InputPassword
              label="Confirm New Password"
              {...form.register("confirmNewPassword")}
              autoComplete="new-password"
            /> */}

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
        ) : status === "tokenExpired" ? (
          <div className="text-center">
            <p className="text-lg">This password reset link has expired.</p>
            <p className="text-sm">
              <Link href="/auth/forgot-password">Request a new link</Link>
            </p>
          </div>
        ) : (
          //status === successfulReset
          <div className="text-center">
            <p className="text-lg">Your password has been reset.</p>
            <p className="text-sm">
              <Link href="/auth/signin">Sign in</Link>
            </p>
          </div>
        )}
      </AuthPanel>
    </>
  );
};

export default ResetPassword;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.params?.token as string;

  const validationResult = await verificationTokenService.validate(token);

  const isTokenValid =
    validationResult.status === "valid" &&
    !!(await userService.findUnique({ id: Number(validationResult.identifier) }));

  return {
    props: {
      isTokenValid,
      token,
    },
  };
}
