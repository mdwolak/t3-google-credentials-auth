import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";

export default async function UnauthenticatedLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
