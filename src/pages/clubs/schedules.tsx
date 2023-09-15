import { useState } from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { getLayout } from "~/components/layouts/Layout";
import CreateScheduleDialog from "~/components/schedules/create.schedule.dialog";
import UpdateScheduleDialog from "~/components/schedules/update.schedule.dialog";
import { type ScheduleInfo } from "~/server/api/routers/schedule.router";
import { api } from "~/utils/api";

const ScheduleList = () => {
  const apiContext = api.useContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateSchedule, setUpdateSchedule] = useState<ScheduleInfo | null>(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState<number>(0);

  const { data: schedule } = api.schedule.getFiltered.useQuery(
    { limit: 10, page: 1 },
    {
      select: (data) => data?.schedules,
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  const { mutate: deleteSchedule } = api.schedule.delete.useMutation({
    onSuccess() {
      apiContext.schedule.invalidate();
      toast.success("Schedule deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Schedule"
        buttonText="Add Schedule"
        onButtonClick={() => setOpenCreate(true)}>
        Manage schedules for your account.
      </TableCaption>
      <div>
        {schedule?.length === 0 ? (
          <Message>There are no schedules at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Schedule</THeader>
                  <THeader screen="sm">Start Date</THeader>
                  <THeader screen="lg">End Date</THeader>
                  <THeader screen="lg">Created</THeader>
                  {/* <THeader>Price</THeader> */}
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule?.map((schedule) => (
                  <tr key={schedule.id}>
                    <TCell first>{schedule.name}</TCell>
                    <TCell screen="sm">
                      <FormattedDate date={schedule.startDate} />
                    </TCell>
                    <TCell screen="lg">
                      {schedule.endDate && <FormattedDate date={schedule.endDate} />}
                    </TCell>
                    <TCell screen="lg">
                      <FormattedDate date={schedule.createdAt} />
                    </TCell>
                    {/* <TCell>
                  <div className="sm:hidden">{schedule.price}/mo</div>
                  <div className="hidden sm:block">{schedule.price}/month</div>
                </TCell> */}
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateSchedule(schedule)}>
                        Edit<span className="sr-only">, {schedule.name}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteScheduleId(schedule.id)}>
                        Delete<span className="sr-only">, {schedule.name}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateSchedule} onClose={() => setUpdateSchedule(null)}>
        <UpdateScheduleDialog
          schedule={updateSchedule as ScheduleInfo}
          handleClose={() => setUpdateSchedule(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateScheduleDialog handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
        open={!!deleteScheduleId}
        handleClose={(confirm) => {
          if (confirm) deleteSchedule(deleteScheduleId);
          setDeleteScheduleId(0);
        }}
      />
    </div>
  );
};
ScheduleList.getLayout = getLayout;
export default ScheduleList;
