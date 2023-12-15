import { SignInEmail } from "~/app/auth/signin/signin-email";
import { SignInOAuth } from "~/app/auth/signin/signin-oauth";
import AuthPanel from "~/components/auth/AuthPanel";

export const metadata = {
  title: "Sign in",
  description: "Sign in",
};

export default async function SignInPage() {
  return (
    <>
      <AuthPanel showLogo heading="Sign in">
        <div className="space-y-6">
          <SignInOAuth />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>{" "}
          <SignInEmail />
        </div>
      </AuthPanel>
    </>
  );
}
