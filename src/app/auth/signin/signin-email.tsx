"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import z, { type TypeOf } from "zod";

import { Alert, Button, Link } from "~/components/core";
import { Form, InputEmail, InputPassword, useForm } from "~/components/forms";
import { ErrorCode } from "~/lib/errorCodes";
import { email } from "~/lib/schemas/user.schema";

const userLoginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});
export type UserLoginInput = TypeOf<typeof userLoginSchema>;

const t = (message: string) => message; //@
const errorMessages: { [key: string]: string } = {
  [ErrorCode.InvalidEmailOrPassword]: "Invalid email or password",
  [ErrorCode.EmailAndPasswordAreRequired]: "E-mail and password are required",
  [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t(
    "please_try_again_and_contact_us",
  )}`,
};

export function SignInEmail() {
  const router = useRouter();
  const form = useForm({ schema: userLoginSchema });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const callbackUrl = (searchParams?.get("callbackUrl") as string) || "/";

  const handleSubmit = async (values: UserLoginInput) => {
    const res = await signIn<"credentials">("credentials", {
      ...values,
      redirect: false,
      callbackUrl,
    });

    if (res?.ok) {
      //successful login
      //form.resetField("password");
      router.push(res.url as string);
    } else if (res?.error && errorMessages[res.error])
      setErrorMessage(errorMessages[res.error] as string);
    else {
      setErrorMessage(errorMessages[ErrorCode.InternalServerError] as string);
      console.error(
        !res
          ? "SignIn returned empty response"
          : `Unknown signIn error: ${res.error}. Status: ${res.status}`,
      );
    }
  };

  return (
    <>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Form form={form} handleSubmit={handleSubmit}>
        <fieldset className="space-y-6" disabled={form.formState.isSubmitting}>
          <InputEmail
            label="Email"
            defaultValue="me@example.com"
            // defaultValue2={router.query.email as string}
            placeholder="me@example.com"
            {...form.register("email")}
          />
          <div className="relative">
            <div className="relative">
              <InputPassword
                label="Password"
                {...form.register("password")}
                autoComplete="current-password"
                defaultValue="tester01"
              />
            </div>
            <span className="absolute -top-[2px] right-0 z-auto">
              <Link className="text-sm" href="/auth/forgot-password">
                Forgot password?
              </Link>
            </span>
          </div>

          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            disabled={!form.formState.isDirty}
            fullWidth>
            Sign in
          </Button>

          <div className="text-sm">
            {"Don't have an account?"} <Link href="/auth/signup">Sign up</Link>
          </div>
        </fieldset>
      </Form>
    </>
  );
}
