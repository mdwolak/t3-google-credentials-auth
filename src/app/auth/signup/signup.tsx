"use client";

import { signIn } from "next-auth/react";

import { ApiErrorMessage, Button, Link } from "~/components/core";
import {
  Form,
  Input,
  InputEmail,
  InputPassword,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type CreateUserInput, createUserSchema } from "~/lib/schemas/user.schema";
import { api } from "~/trpc/client";

export function SignUp() {
  const form = useForm({
    schema: createUserSchema,
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
  } = api.user.create.useMutation({
    async onSuccess() {
      await signIn<"credentials">("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
        callbackUrl: `/verify-email`,
      });
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (values: CreateUserInput) => {
    apiUserCreate(values);
  };

  return (
    <>
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

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!form.formState.isDirty || !form.formState.isValid}>
            Sign up
          </Button>

          <div className="text-sm">
            Already have an account? <Link href="/auth/signin">Sign in</Link>
          </div>
        </fieldset>
      </Form>
    </>
  );
}

export default SignUp;
