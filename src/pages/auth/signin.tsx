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
import FacebookIcon from "~/components/icons/facebook";
import GoogleIcon from "~/components/icons/google.svg";
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
            icon={<Image src={GoogleIcon} alt="Google" />}>
            Continue with Google{" "}
          </Button>
          <Button variant="secondary" className="text-blue-500" icon={<FacebookIcon />}>
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
