import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { Toaster } from "react-hot-toast";
import { type TypeOf, object, string } from "zod";

import AuthPanel from "~/components/auth/AuthPanel";
import { Alert, Button, Link, SEOHead } from "~/components/core";
import { Form, InputEmail, InputPassword, useForm } from "~/components/forms";
import { ErrorCode } from "~/lib/errorCodes";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";

const userLoginSchema = object({
  csrfToken: string(),
  email: string().min(1, "Email address is required").email("Email Address is invalid"),
  password: string().min(1, "Password is required"),
});
export type UserLoginInput = TypeOf<typeof userLoginSchema>;

const SignIn = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = (message: string) => message; //@
  const router = useRouter();
  const form = useForm({ schema: userLoginSchema });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const errorMessages: { [key: string]: string } = {
    [ErrorCode.IncorrectPassword]: `${t("incorrect_password")} ${t("please_try_again")}`,
    [ErrorCode.UserNotFound]: t("no_account_exists"),
    [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t(
      "please_try_again_and_contact_us"
    )}`,
  };

  const handleSubmit = async (values: UserLoginInput) => {
    setErrorMessage(null); //@ is this needed?

    const res = await signIn<"credentials">("credentials", {
      ...values,
      redirect: false,
    });

    if (res?.ok) {
      //successful login
      form.resetField("password");
      router.push(res.url as string);
    }
    //@ return error message in a useMutation and remove hooks
    else if (res?.error && errorMessages[res.error])
      setErrorMessage(errorMessages[res.error] as string);
    else {
      setErrorMessage(t("something_went_wrong"));
      console.error(
        !res
          ? "SignIn returned empty response"
          : `Unknown signIn error: {res.error}. Status: {res.status}`
      );
    }
  };

  return (
    <>
      <SEOHead title="Sign in" description="Sign in" />
      <AuthPanel showLogo heading="Sign in">
        <div className="space-y-6">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Button
            onClick={() => signIn("google")}
            variant="secondary"
            icon={
              <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"></path>
                <path
                  fill="#34A853"
                  d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"></path>
                <path
                  fill="#FBBC05"
                  d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"></path>
                <path
                  fill="#EA4335"
                  d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"></path>
                <path fill="none" d="M2 2h44v44H2z"></path>
              </svg>
              //   gray fa icon
              //   <svg
              //   stroke="currentColor"
              //   fill="currentColor"
              //   viewBox="0 0 488 512"
              //   xmlns="http://www.w3.org/2000/svg">
              //   <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              // </svg>
            }>
            Continue with Google{" "}
            <Image
              src="/assets/google.svg"
              alt="Your Company"
              className="relative h-2"
              fill
              sizes="100vw"
            />
          </Button>
          <Button
            variant="secondary"
            className="text-blue-500"
            icon={
              <svg fill="none" aria-labelledby="fb-app-logo" viewBox="0 0 30 30">
                <title id="fb-app-logo">Facebook app logo</title>
                <path
                  d="M30 15.091C30 6.756 23.285 0 15 0S0 6.756 0 15.091C0 22.625 5.484 28.868 12.656 30V19.454H8.848V15.09h3.808v-3.324c0-3.782 2.239-5.872 5.666-5.872 1.64 0 3.358.295 3.358.295v3.714h-1.893c-1.863 0-2.443 1.164-2.443 2.358v2.83h4.16l-.665 4.362h-3.495V30C24.516 28.868 30 22.625 30 15.091z"
                  fill="currentColor"></path>
              </svg>
            }>
            Continue with Facebook
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>{" "}
          <Form form={form} handleSubmit={handleSubmit}>
            <div>
              <input
                defaultValue={csrfToken || undefined}
                type="hidden"
                hidden
                {...form.register("csrfToken")}
              />
            </div>
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
                  <Link className="text-sm" href="/auth/signup">
                    Forgot password?
                  </Link>
                </span>
              </div>

              <Button isLoading={form.formState.isSubmitting}>Sign in</Button>

              <div className="text-sm">
                {"Don't have an account?"} <Link href="/auth/signup">Sign up</Link>
              </div>
            </fieldset>
          </Form>
        </div>
      </AuthPanel>
      <Toaster position="bottom-right" />
    </>
  );
};
export default SignIn;

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

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
