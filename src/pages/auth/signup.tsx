import { useRouter } from "next/router";

import AuthPanel from "~/components/auth/AuthPanel";
import { Alert, Button, Link, SEOHead } from "~/components/core";
import { Form, InputEmail, InputPassword, useForm } from "~/components/forms";
import { type UserCreateInput, userCreateSchema } from "~/lib/schemas/user";
import { trpc } from "~/utils/trpc";

const SignUp = () => {
  const router = useRouter();
  const form = useForm({
    schema: userCreateSchema,
    //@ remove default values
    defaultValues: {
      email: "me@example.com", //router.query.email
      name: "",
      password: "tester01",
      passwordConfirm: "tester01",
    },
  });

  const {
    mutate: userCreateApi,
    isLoading,
    error,
  } = trpc.user.create.useMutation({
    onSuccess() {
      router.push("signin");
    },
  });

  const handleSubmit = (values: UserCreateInput) => {
    userCreateApi(values);
  };

  return (
    <>
      <SEOHead title="Sign up" description="Create your account" />
      <AuthPanel showLogo heading="Sign up">
        {error && <Alert severity="error">{error.message}</Alert>}
        <Form form={form} handleSubmit={handleSubmit}>
          <fieldset className="space-y-6" disabled={isLoading}>
            <InputEmail label="Email" placeholder="me@example.com" {...form.register("email")} />
            <InputPassword
              label="Password"
              {...form.register("password")}
              autoComplete="new-password"
            />
            <InputPassword
              label="Confirm Password"
              {...form.register("passwordConfirm")}
              autoComplete="new-password"
            />

            <Button isLoading={isLoading}>Sign up</Button>

            <div className="text-sm">
              Already have an account? <Link href="/auth/signin">Sign in</Link>
            </div>
          </fieldset>
        </Form>
      </AuthPanel>
    </>
  );
};

export default SignUp;
