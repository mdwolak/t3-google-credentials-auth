"use client";

import { useState } from "react";

import { ApiErrorMessage, Button, Link, toast } from "~/components/core";
import { Form, Input, InputPassword, ValidationSummary, useForm } from "~/components/forms";
import { type ResetPasswordInput, resetPasswordSchema } from "~/lib/schemas/user.schema";
import { api } from "~/utils/api";

//Entry point: user clicks on password reset link in email
type ResetPasswordProps = {
  isTokenValid: boolean;
  token: string;
};

export function ResetPassword({ isTokenValid, token }: ResetPasswordProps) {
  const [status, setStatus] = useState<"enterPassword" | "tokenExpired" | "successfulReset">(
    isTokenValid ? "enterPassword" : "tokenExpired",
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
    </>
  );
}
