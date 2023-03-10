import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import toast, { Toaster } from "react-hot-toast";

import AuthPanel from "~/components/auth/AuthPanel";
import { Alert, LoadingButton, SEOHead } from "~/components/core";
import { Form, useForm } from "~/components/forms/Form";
import { Input, InputEmail, InputPassword } from "~/components/forms/Input";
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
      router.push("/login");
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
            <Input label="Username" {...form.register("name")} />
            <InputEmail
              label="Email"
              // defaultValue2={router.query.email as string}
              placeholder="me@example.com"
              {...form.register("email")}
            />
            <InputPassword label="Password" {...form.register("password")} />
            <InputPassword label="Confirm Password" {...form.register("passwordConfirm")} />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <LoadingButton isLoading={isLoading}>Sign up</LoadingButton>

            <span className="block">
              Already have an account?{" "}
              <Link href="/login" className="text-ct-blue-600">
                Login Here
              </Link>
            </span>
          </fieldset>
        </Form>
      </AuthPanel>
      <Toaster position="bottom-right" />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      requireAuth: false,
      enableAuth: false,
    },
  };
};

export default SignUpPage;

// export default function SignUp({ prepopulateFormValues }: ServerSideProps<typeof getServerSideProps>) {

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
