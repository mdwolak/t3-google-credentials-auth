import { redirect } from "next/navigation";

import { Toaster } from "~/components/core";
import { DesktopNavbar } from "~/components/navbars/DesktopNavbar";
import { MobileNavbar } from "~/components/navbars/MobileNavbar";
import { Navbar } from "~/components/navbars/Navbar";
import { NextAuthProvider } from "~/components/providers/next-auth";
import { getSession } from "~/server/auth";

export default async function DashboardLayout({ children }: React.PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const navbar = <Navbar user={session.user} />;

  return (
    <>
      <NextAuthProvider session={session}>
        <MobileNavbar>{navbar}</MobileNavbar>

        <DesktopNavbar>{navbar}</DesktopNavbar>

        <div className="lg:pl-72">
          <main>{children}</main>
        </div>
        <Toaster position="bottom-right" />
        {/* <div id="main-modal"></div> */}
      </NextAuthProvider>
    </>
  );
}
