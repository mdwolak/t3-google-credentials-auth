import { useRouter } from "next/router";

import AuthPanel from "~/components/auth/AuthPanel";
import { ApiErrorMessage, Button, Link, SEOHead } from "~/components/core";
import {
  Form,
  Input,
  InputEmail,
  InputPassword,
  ValidationSummary,
  useForm,
} from "~/components/forms";
import { type UserCreateInput, userCreateSchema } from "~/lib/schemas/user";
import { trpc } from "~/utils/trpc";

const SignUp = () => {
  const router = useRouter();
  const form = useForm({
    schema: userCreateSchema,
    //@ remove default values
    defaultValues: {
      email: "me@example.com", //router.query.email
      name: "John Doe",
      password: "tester01",
      passwordConfirm: "tester01",
    },
  });

  const {
    mutate: apiUserCreate,
    isLoading,
    error: apiError,
  } = trpc.user.create.useMutation({
    onSuccess() {
      router.push("signin");
    },
  });

  const handleSubmit = (values: UserCreateInput) => {
    apiUserCreate(values);
  };

  return (
    <>
      <SEOHead title="Sign up" description="Create your account" />
      <AuthPanel showLogo heading="Sign up">
        <ValidationSummary errors={form.formState.errors} />
        <ApiErrorMessage error={apiError} visible={form.formState.isValid} />
        <Form form={form} handleSubmit={handleSubmit}>
          <fieldset className="space-y-6" disabled={isLoading}>
            <Input label="Name" {...form.register("name")} />
            <InputEmail label="Email" {...form.register("email")} />
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

            <Button type="submit" isLoading={isLoading}>
              Sign up
            </Button>

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
