import { redirect } from "next/navigation";

import { Toaster } from "~/components/core";
import { DesktopNavbar } from "~/components/navbars/DesktopNavbar";
import { MobileNavbar } from "~/components/navbars/MobileNavbar";
import { Navbar } from "~/components/navbars/Navbar";
import { NextAuthProvider } from "~/components/providers/next-auth";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/signin");
  }

  const navbar = <Navbar user={session.user} />;

  return (
    <>
      <NextAuthProvider session={session}>
        <MobileNavbar>{navbar}</MobileNavbar>

        <DesktopNavbar>{navbar}</DesktopNavbar>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Toaster position="bottom-right" />
      </NextAuthProvider>
    </>
  );
}
