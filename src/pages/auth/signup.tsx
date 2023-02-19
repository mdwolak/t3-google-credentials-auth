import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import type { inferServerSideProps } from "~/server/lib/inferServerSideProps"
import type { GetServerSideProps, NextPage } from "next";
import { object, string, type TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from '~/components/forms/Form';
import { useEffect } from "react";
import { InputField } from "~/components/forms/InputField";
import Link from "next/link";
import { LoadingButton } from "~/components/LoadingButton";
import AuthPanel from "~/components/auth/AuthPanel";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import toast, { Toaster } from 'react-hot-toast';

const registerUserSchema = object({
  name: string().min(1, "Full name is required").max(100),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});
export type RegisterUserInput = TypeOf<typeof registerUserSchema>;

const RegisterPage: NextPage = () => {
  const t = (message: string) => message;
  const register = () => null;
  const router = useRouter();
  const { mutate: SignUpUser, isLoading } = trpc.auth.registerUser.useMutation({
    onSuccess(data) {
      toast.success(`Welcome ${data.data.user.name}!`);
      router.push("/login");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  /** Form */
  const form = useForm({ schema: registerUserSchema });

  const {
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const handleSubmit = (values: RegisterUserInput) => {
    // 👇 Execute the Mutation
    SignUpUser(values);
  };
  return (
    <>
      <AuthPanel
        title="Signup Page"
        description="Sign Up To Get Started"
        showLogo
        heading="Sign Up To Get Started!"
      >
        <Form form={form} handleSubmit={handleSubmit}></Form>
        <div className="space-y-6">
          <InputField label="Email" type="email"
            defaultValue={router.query.email as string}
            placeholder="john.doe@example.com"
            required
            {...form.register('email')} />
          <InputField label="Password" type="password" {...form.register('password')} />
          <InputField
            label="Confirm Password"
            type="password"
            {...form.register('passwordConfirm')}
          />


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

          <LoadingButton loading={isLoading}>Sign Up</LoadingButton>

          {/* <Button
                type="submit"
                color="primary"
                disabled={formState.isSubmitting}
                className="w-full justify-center">
                {twoFactorRequired ? t("submit") : t("sign_in")}
              </Button> */}

          {/* 

            <span className="block">
              Already have an account?{" "}
              <Link href="/login" className="text-ct-blue-600">Login Here</Link>
            </span>
            */}
        </div>
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

export default RegisterPage;




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


