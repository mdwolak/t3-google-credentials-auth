import { redirect } from "next/navigation";

import { getSession } from "~/server/auth";

export default async function UnauthenticatedLayout({ children }: React.PropsWithChildren) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
