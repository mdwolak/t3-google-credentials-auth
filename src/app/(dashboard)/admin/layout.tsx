import { getRequiredSessionUser } from "~/server/auth";
import { isAdmin } from "~/server/services/permission.service";

export default async function AdminLayout({ children }: React.PropsWithChildren) {
  const user = await getRequiredSessionUser();

  if (!isAdmin(user)) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <div>{children}</div>
    </>
  );
}
