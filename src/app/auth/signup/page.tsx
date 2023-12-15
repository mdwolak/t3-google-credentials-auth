import { SignUp } from "~/app/auth/signup/signup";
import AuthPanel from "~/components/auth/AuthPanel";

export const metadata = {
  title: "Sign up",
  description: "Create your account",
};

export default async function SignUpPage() {
  return (
    <>
      <AuthPanel showLogo heading="Sign up">
        <SignUp />
      </AuthPanel>
    </>
  );
}
