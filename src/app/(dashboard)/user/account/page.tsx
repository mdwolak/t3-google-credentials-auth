import PageHeader from "~/components/sections/PageHeader";
import { getRequiredSessionUser } from "~/server/auth";
import { api } from "~/trpc/server";

import UpdateUserProfile from "./_components/update.user.profile";

/* @see: https://tailwindui.com/components/application-ui/page-examples/settings-screens */

export default async function AccountPage() {
  const { id: userId } = await getRequiredSessionUser();

  const user = await api.user.getById.query(userId);

  return (
    <div className="flex justify-start">
      <div className="w-full max-w-3xl">
        <PageHeader title="Account" />
        <UpdateUserProfile user={user} />
      </div>
    </div>
  );
}
