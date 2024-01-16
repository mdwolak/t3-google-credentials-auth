import PageHeader from "~/components/sections/PageHeader";
import { getRequiredSessionUser } from "~/server/auth";
import { api } from "~/trpc/server";

import UpdateUserPassword from "./_components/update.user.password";
import UpdateUserProfile from "./_components/update.user.profile";

/* @see: https://tailwindui.com/components/application-ui/page-examples/settings-screens */

export default async function AccountPage() {
  const { id: userId } = await getRequiredSessionUser();

  const user = await api.user.getById.query(userId);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="divide-y divide-black/5">
        <UpdateUserProfile user={user} />
        <UpdateUserPassword userId={user.id} />
      </div>
    </div>
  );
}
