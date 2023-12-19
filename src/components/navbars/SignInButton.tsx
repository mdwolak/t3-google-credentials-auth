"use client";

import { type SessionUser } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function SignInButton({ user }: { user?: SessionUser }) {
  return (
    <li className="cursor-pointer">
      {user ? (
        <Link
          href="#"
          onClick={() => signOut()}
          className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">
          Sign out
        </Link>
      ) : (
        <Link
          href="#"
          onClick={() => signIn()}
          className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">
          Sign in
        </Link>
      )}
    </li>
  );
}
