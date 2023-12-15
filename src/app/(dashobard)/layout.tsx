import { redirect } from "next/navigation";

import { NextAuthProvider } from "~/components/providers/next-auth";
import { getServerAuthSession } from "~/server/auth";

export default async function AuthenticatedLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <NextAuthProvider session={session}>{children}</NextAuthProvider>;
    </>
  );
}
