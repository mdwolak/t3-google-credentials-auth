import { NextAuthProvider } from "~/components/providers/next-auth";

export default async function PublicLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <NextAuthProvider>{children}</NextAuthProvider>
    </>
  );
}
