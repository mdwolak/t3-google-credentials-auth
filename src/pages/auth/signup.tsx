import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import toast, { Toaster } from "react-hot-toast";

import AuthPanel from "~/components/auth/AuthPanel";
import { Alert, Link, LoadingButton, SEOHead } from "~/components/core";
import { Form, Input, InputEmail, InputPassword, useForm } from "~/components/forms";
import { type UserCreateInput, userCreateSchema } from "~/lib/schemas/user";
import { trpc } from "~/utils/trpc";

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const form = useForm({ schema: userCreateSchema });

  const {
    mutate: userCreateApi,
    isLoading,
    error,
  } = trpc.user.create.useMutation({
    onSuccess(data) {
      toast.success(`Welcome ${data.data.user.name}!`);
      router.push("signin");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: UserCreateInput) => {
    userCreateApi(values);
  };

  //@ remove default values
  return (
    <>
      <SEOHead title="Sign up" description="Create your account" />
      <AuthPanel showLogo heading="Sign Up">
        {error && <Alert severity="error">Something went wrong! {error.message}</Alert>}
        <Form form={form} handleSubmit={handleSubmit}>
          <fieldset className="space-y-6" disabled={isLoading}>
            <Input label="Username" {...form.register("name")} autoComplete="username" />
            <InputEmail
              label="Email"
              defaultValue="me@example.com"
              // defaultValue2={router.query.email as string}
              placeholder="me@example.com"
              {...form.register("email")}
            />
            <InputPassword
              label="Password"
              {...form.register("password")}
              autoComplete="new-password"
              defaultValue="tester01"
            />
            <InputPassword
              label="Confirm Password"
              {...form.register("passwordConfirm")}
              autoComplete="new-password"
              defaultValue="tester01"
            />
            <div className="text-sm">
              <Link href="/login">Forgot your password?</Link>
            </div>

            <LoadingButton isLoading={isLoading}>Sign up</LoadingButton>

            <div className="text-sm">
              Already have an account? <Link href="/login">Login Here</Link>
            </div>
          </fieldset>
        </Form>
      </AuthPanel>
      <Toaster position="bottom-right" />
    </>
  );
};

export default SignUpPage;
