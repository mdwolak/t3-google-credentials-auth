import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";

import { useState, useCallback } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import type { ServerSideProps } from "../../lib/types/ServerSideProps"

import { prisma } from "../../server/db/client";

interface IFormInputs {
  username: string;
  email: string;
  password: string;
  passwordcheck: string;
  apiError: string;
}

// export default function SignUp({ prepopulateFormValues }: ServerSideProps<typeof getServerSideProps>) {
export default function SignUp() {
  const t = (message: string) => message;

  const methods = useForm<IFormInputs>(); //{ defaultValues: prepopulateFormValues }
  const { register, formState: { errors } } = methods;

  const handleErrors = useCallback(async (resp: Response) => {
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message);
    }
  }, []);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    await fetch("/api/auth/signup", {
      body: JSON.stringify({ ...data }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then(handleErrors)
      .then(async () => {
        await signIn("custom");
      })
      .catch((err) => {
        methods.setError("apiError", { message: err.message });
      });
  };

  return (
    <div
      className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="font-cal text-center text-3xl font-extrabold text-gray-900">
          {t("create_your_account")}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-2 bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 bg-white">
              Api:{errors.apiError && <div>{errors.apiError.message}</div>}
              {/* {errors.apiError && <Alert severity="error" message={errors.apiError?.message} />} */}
              <div className="space-y-2">
                Username
                <input type="text"
                  {...register("username")}
                  required
                  defaultValue={"mrwolak"}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                Email
                <input id="email" {...register("email")}
                  type="email"
                  required
                  defaultValue={"mrwolak@hotmail.com"}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                Password
                <input type="password"
                  // className="block text-sm font-medium tsext-gray-700"
                  {...register("password")}
                  required
                  defaultValue={"mrwolak"}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {t("confirm_password")}
                <input type="password"
                  {...register("passwordcheck", {
                    validate: (value) =>
                      value === methods.watch("password") || (t("error_password_mismatch") as string),
                  })}
                  required
                  defaultValue={"mrwolak"}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button type="submit" className="w-7/12 justify-center">
                  {t("create_account")}
                </button>
                <button
                  color="secondary"
                  className="w-5/12 justify-center"
                  onClick={() =>
                    signIn("Cal.com")
                  }>
                  {t("login_instead")}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const token = asStringOrNull(ctx.query.token);

//   const props = {
//     prepopulateFormValues: undefined,
//   };

//   // no token given, treat as a normal signup without verification token
//   if (!token) {
//     return {
//       props: JSON.parse(JSON.stringify(props)),
//     };
//   }

//   const verificationToken = await prisma.verificationToken.findUnique({
//     where: {
//       token,
//     },
//   });

//   if (!verificationToken || veri ficationToken.expires < new Date()) {
//     return {
//       notFound: true,
//     };
//   }

//   const existingUser = await prisma.user.findFirst({
//     where: {
//       AND: [
//         {
//           email: verificationToken?.identifier,
//         },
//         {
//           emailVerified: {
//             not: null,
//           },
//         },
//       ],
//     },
//   });

//   if (existingUser) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/auth/login?callbackUrl=" + `/${ctx.query.callbackUrl}`,
//       },
//     };
//   }

//   return {
//     props: {
//       ...props,
//       prepopulateFormValues: {
//         email: verificationToken.identifier,
//       },
//     },
//   };
// };
