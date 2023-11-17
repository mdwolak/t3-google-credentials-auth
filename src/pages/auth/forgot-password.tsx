import { useRouter } from "next/router";

import { z } from "zod";

import AuthPanel from "~/components/auth/AuthPanel";
import { ApiErrorMessage, Button, Link, SEOHead, toast } from "~/components/core";
import {
  Form,
  InputEmail,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type ForgotPasswordInput, forgotPasswordSchema } from "~/lib/schemas/user.schema";
import { api } from "~/utils/api";

const ForgotPassword = () => {
  const router = useRouter();

  const form = useForm({ schema: forgotPasswordSchema });

  const {
    mutate: apiForgotPassword,
    isLoading,
    error: apiError,
  } = api.user.forgotPassword.useMutation({
    onSuccess(data) {
      toast.success("Password reset email sent!");
      console.log(data);
      //router.push("/auth/signin");
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
      </AuthPanel>
    </>
  );
};

export default ForgotPassword;
