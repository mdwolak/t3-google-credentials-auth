import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import toast, { Toaster } from "react-hot-toast";
import { type TypeOf, object, string } from "zod";

import { LoadingButton } from "~/components/LoadingButton";
import AuthPanel from "~/components/auth/AuthPanel";
import { Form, useForm } from "~/components/forms/Form";
import { Input, InputEmail, InputPassword } from "~/components/forms/Input";
import { trpc } from "~/utils/trpc";

const registerUserSchema = object({
  //TODO: uncomment and try to display error above the form using errors collection
  name: string()
    .min(3, "Username must be at least 3 characters long!")
    .max(10, "Consider using shorter username."),
  email: string().min(1, "Email address is required").email("Email Address is invalid"),
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
        heading="Sign Up To Get Started!">
        <Form form={form} handleSubmit={handleSubmit}>
          <fieldset className="space-y-6" disabled={form.formState.isSubmitting}>
            <Input label="Username" placeholder="john doe" required {...form.register("name")} />
            <InputEmail
              label="Email"
              defaultValue={router.query.email as string}
              placeholder="john.doe@example.com"
              required
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

            <LoadingButton loading={isLoading}>Sign Up</LoadingButton>

            {/* 

            <span className="block">
              Already have an account?{" "}
              <Link href="/login" className="text-ct-blue-600">Login Here</Link>
            </span>
            */}
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
