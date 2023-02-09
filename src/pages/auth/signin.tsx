import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Image from 'next/image'
import Link from "next/link";
import { getCsrfToken, signIn } from "next-auth/react";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorCode } from "~/lib/errorCodes";

import type { inferServerSideProps } from "~/server/lib/inferServerSideProps"

import AuthPanel from "~/components/auth/AuthPanel";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";
interface IFormInputs {
  email: string;
  password: string;
  csrfToken: string;
}

export default function SignIn({ csrfToken }: inferServerSideProps<typeof getServerSideProps>) {
  const t = (message: string) => message;
  const router = useRouter();
  const methods = useForm<IFormInputs>();

  const { register, formState } = methods;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const errorMessages: { [key: string]: string } = {
    [ErrorCode.IncorrectPassword]: `${t("incorrect_password")} ${t("please_try_again")}`,
    [ErrorCode.UserNotFound]: t("no_account_exists"),
    [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t("please_try_again_and_contact_us")}`,
  };

  const LoginFooter = (
    <Link href={'/auth/signup'} className='text-brand-500 font-medium'>{t("dont_have_an_account")} Sign Up</Link>
  );

  const onSubmit = async (values: IFormInputs) => {
    setErrorMessage(null);
    const res = await signIn<"credentials">("credentials", {
      ...values,
      redirect: false,
    });

    if (res?.ok)  //successful login
      router.push(res.url as string);
    else if (res?.error && errorMessages[res?.error])
      setErrorMessage(errorMessages[res.error] as string)
    else {
      setErrorMessage(t("something_went_wrong"));
      console.error(!res
        ? "SignIn returned empty response"
        : `Unknown signIn error: {res.error}. Status: {res.status}`)
    }

  };

  return (
    <>
      <AuthPanel
        title={t("login")}
        description={t("login")}
        showLogo
        heading={t("welcome_back")}
        footerText={LoginFooter}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div>
              <input defaultValue={csrfToken || undefined} type="hidden" hidden {...register("csrfToken")} />
            </div>
            <div className="space-y-6">
              <div>
                <div>Email Address</div>
                <input id="email"
                  type="email"
                  defaultValue={router.query.email as string}
                  placeholder="john.doe@example.com"
                  required
                  {...register("email")}
                />
                <div className="relative">
                  <div className="absolute right-0 -top-[6px] z-10">
                    <Link href="/auth/forgot-password" tabIndex={-1} className="text-sm font-medium text-gray-600">
                      {t("forgot")}
                    </Link>
                  </div>
                  <div>Password</div>
                  <input type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="mb-0"
                    {...register("password")}
                  />
                </div>
              </div>

              {errorMessage && <div>{errorMessage}</div>}
              <button
                type="submit"
                color="primary"
                disabled={formState.isSubmitting}
                className="w-full justify-center">
                {t("sign_in")}
              </button>
            </div>
          </form>
          <button type='button' onClick={() => signIn('google')} className="w-full justify-center">
            Sign In with Google <Image src={'/assets/google.svg'} width="20" height={20} alt={""} ></Image>
          </button>
        </FormProvider>
      </AuthPanel>
    </>
  );
}

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

