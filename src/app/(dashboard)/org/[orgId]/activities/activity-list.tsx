"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { type ActivityInfo } from "~/server/api/routers/activity.router";
import { api } from "~/utils/api";

import CreateActivityDialog from "./_components/create.activity.dialog";
import UpdateActivityDialog from "./_components/update.activity.dialog";

export function ActivityList({ orgId }: { orgId: number }) {
  const apiUtils = api.useUtils();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateActivity, setUpdateActivity] = useState<ActivityInfo | null>(null);
  const [deleteActivityId, setDeleteActivityId] = useState<number>(0);

  const { data: activities } = api.activity.getFiltered.useQuery(
    { orgId, limit: 10, page: 1 },
    {
      enabled: !!orgId,
      select: (data) => data?.activities,
      onError(error) {
        toast.error(error.message);
      },
    },
  );

  const { mutate: deleteActivity } = api.activity.delete.useMutation({
    onSuccess() {
      apiUtils.activity.invalidate();
      toast.success("Activity deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Activities"
        buttonText="Add Activity"
        onButtonClick={() => setOpenCreate(true)}>
        Manage activities for your account.
      </TableCaption>
      <div>
        {activities?.length === 0 ? (
          <Message>There are no activities at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Activity</THeader>
                  <THeader screen="sm">Address</THeader>
                  <THeader>Schedules</THeader>
                  <THeader screen="lg">Created</THeader>
                  {/* <THeader>Price</THeader> */}
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities?.map((activity) => (
                  <tr key={activity.id}>
                    <TCell first>
                      {activity.name}
                      {activity.description && (
                        <span className="ml-1 text-indigo-600">(published)</span>
                      )}
                    </TCell>
                    <TCell screen="sm">{activity.addressId}</TCell>
                    <TCell>
                      <Link href={`/org/${orgId}/activities/${activity.id}/schedules`}>
                        Schedules
                      </Link>
                    </TCell>
                    <TCell screen="lg">
                      <FormattedDate date={activity.createdAt} />
                    </TCell>
                    {/* <TCell>
                  <div className="sm:hidden">{activity.price}/mo</div>
                  <div className="hidden sm:block">{activity.price}/month</div>
                </TCell> */}
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateActivity(activity)}>
                        Edit<span className="sr-only">, {activity.name}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteActivityId(activity.id)}>
                        Delete<span className="sr-only">, {activity.name}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateActivity} onClose={() => setUpdateActivity(null)}>
        <UpdateActivityDialog
          activity={updateActivity as ActivityInfo}
          handleClose={() => setUpdateActivity(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateActivityDialog handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete activity"
        description="Are you sure you want to delete this activity? This action cannot be undone."
        open={!!deleteActivityId}
        handleClose={(confirm) => {
          if (confirm) deleteActivity(deleteActivityId);
          setDeleteActivityId(0);
        }}
      />
    </div>
  );
}
