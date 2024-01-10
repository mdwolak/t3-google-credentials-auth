"use client";

import { useState } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { type UserInfo } from "~/server/api/routers/user.router";
import { api } from "~/trpc/client";

import CreateUserDialog from "./_components/create.user.dialog";
import UpdateUserDialog from "./_components/update.user.dialog";

export default function UserList() {
  const apiUtils = api.useUtils();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateUser, setUpdateUser] = useState<UserInfo | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number>(0);

  const { data: users } = api.user.getFiltered.useQuery(
    { limit: 10, page: 1 },
    {
      select: (data) => data?.users,
      onError(error) {
        toast.error(error.message);
      },
    },
  );

  const { mutate: deleteUser } = api.user.delete.useMutation({
    onSuccess() {
      apiUtils.user.invalidate();
      toast.success("User deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption title="Users" buttonText="Add User" onButtonClick={() => setOpenCreate(true)}>
        Manage users for your account.
      </TableCaption>
      <div>
        {users?.length === 0 ? (
          <Message>There are no users at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Id</THeader>
                  <THeader>Name</THeader>
                  <THeader screen="sm">Email</THeader>
                  <THeader screen="lg">Role</THeader>
                  <THeader screen="lg">Provider</THeader>
                  <THeader screen="lg">Created</THeader>
                  <THeader screen="lg">Updated</THeader>
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users?.map((user) => (
                  <tr key={user.id}>
                    <TCell first>{user.id}</TCell>
                    <TCell>
                      {user.name}
                      {"user.active" && <span className="ml-1 text-indigo-600">(published)</span>}
                    </TCell>
                    <TCell screen="sm">
                      <TCell screen="sm">
                        <Link href={`mailto:${user.email}`}>{user.email}</Link>
                        {!user.emailVerified && <i> (not verified)</i>}
                      </TCell>
                    </TCell>
                    <TCell screen="lg">{user.role}</TCell>
                    <TCell screen="lg">{user.signupProvider}</TCell>
                    <TCell screen="lg">
                      <FormattedDate date={user.createdAt} />
                    </TCell>
                    <TCell screen="lg">
                      <FormattedDate date={user.updatedAt} />
                    </TCell>
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateUser(user)}>
                        Edit<span className="sr-only">, {user.name}</span>
                      </Link>
                      <span>|</span>

                      <Link href="#" variant="secondary" onClick={() => setDeleteUserId(user.id)}>
                        Delete<span className="sr-only">, {user.name}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateUser} onClose={() => setUpdateUser(null)}>
        <UpdateUserDialog user={updateUser as UserInfo} handleClose={() => setUpdateUser(null)} />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateUserDialog handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete user"
        description="Are you sure you want to delete this user? This action cannot be undone."
        open={!!deleteUserId}
        handleClose={(confirm) => {
          if (confirm) deleteUser(deleteUserId);
          setDeleteUserId(0);
        }}
      />
    </div>
  );
}
