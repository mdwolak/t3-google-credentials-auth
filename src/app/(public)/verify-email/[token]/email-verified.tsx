"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AuthPanel from "~/components/auth/AuthPanel";
import { Button } from "~/components/core";

export function EmailVerified() {
  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session && !session.user?.emailVerified) {
      update("emailVerified");
    }
  });

  return (
    <AuthPanel showLogo heading="Your email has been verified!">
      {session ? (
        <Button onClick={() => router.push("/getting-started")}>Continue</Button>
      ) : (
        <Button onClick={() => router.push("/auth/signin")}>Sign in</Button>
      )}
    </AuthPanel>
  );
}
