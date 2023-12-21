import { redirect } from "next/navigation";

import { Toaster } from "~/components/core";
import { getSession } from "~/server/auth";

export default async function UnauthenticatedLayout({ children }: React.PropsWithChildren) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  );
}
