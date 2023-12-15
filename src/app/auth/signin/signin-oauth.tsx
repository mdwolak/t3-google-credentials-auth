"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Button } from "~/components/core";
import FacebookIcon from "~/components/icons/facebook";

export function SignInOAuth() {
  const searchParams = useSearchParams();
  const callbackUrl = (searchParams?.get("callbackUrl") as string) || "/";

  return (
    // GoogleIcon would need to be converted to a functional component
    <>
      <Button onClick={() => signIn("google", { callbackUrl })} fullWidth variant="secondary">
        <Image src={"/assets/google.svg"} width="20" height={20} alt={""} className="mr-2" />{" "}
        Continue with Google{" "}
      </Button>
      <Button className="!bg-[#1778f2] hover:opacity-80" Icon={FacebookIcon} fullWidth>
        Continue with Facebook
      </Button>
    </>
  );
}
