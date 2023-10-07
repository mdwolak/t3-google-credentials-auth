import { useRouter } from "next/router";
import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { getLayout } from "~/components/layouts/Layout";
import CreateScheduleDayDialog from "~/components/scheduleDays/create.scheduleDay.dialog";
import UpdateScheduleDayDialog from "~/components/scheduleDays/update.scheduleDay.dialog";
import { type ScheduleDayInfo } from "~/server/api/routers/scheduleDay.router";
import { api } from "~/utils/api";

const ScheduleDayList = () => {
  const apiContext = api.useContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateScheduleDay, setUpdateScheduleDay] = useState<ScheduleDayInfo | null>(null);
  const [deleteScheduleDayId, setDeleteScheduleDayId] = useState<number>(0);

  const router = useRouter();
  const scheduleId = Number(router.query.scheduleId);

  const { data: scheduleDays } = api.scheduleDay.getByScheduleId.useQuery(scheduleId, {
    enabled: !!scheduleId,
    select: (data) => data?.scheduleDays,
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutate: deleteScheduleDay } = api.scheduleDay.delete.useMutation({
    onSuccess() {
      apiContext.scheduleDay.invalidate();
      toast.success("ScheduleDay deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="ScheduleDays"
        buttonText="Add ScheduleDay"
        onButtonClick={() => setOpenCreate(true)}>
        Manage scheduleDays for your account.
      </TableCaption>
      <div>
        {scheduleDays?.length === 0 ? (
          <Message>There are no scheduleDays at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>ScheduleDay</THeader>
                  <THeader screen="sm">Duration</THeader>
                  <THeader screen="lg">StartTime</THeader>
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scheduleDays?.map((scheduleDay) => (
                  <tr key={scheduleDay.id}>
                    <TCell first>{scheduleDay.dayOfWeek}</TCell>
                    <TCell screen="lg">{scheduleDay.duration}</TCell>
                    <TCell screen="lg">
                      <FormattedDate date={scheduleDay.startTime} />
                    </TCell>
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateScheduleDay(scheduleDay)}>
                        Edit<span className="sr-only">, {scheduleDay.id}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteScheduleDayId(scheduleDay.id)}>
                        Delete<span className="sr-only">, {scheduleDay.id}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateScheduleDay} onClose={() => setUpdateScheduleDay(null)}>
        <UpdateScheduleDayDialog
          scheduleDay={updateScheduleDay as ScheduleDayInfo}
          handleClose={() => setUpdateScheduleDay(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateScheduleDayDialog scheduleId={scheduleId} handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete scheduleDay"
        description="Are you sure you want to delete this scheduleDay? This action cannot be undone."
        open={!!deleteScheduleDayId}
        handleClose={(confirm) => {
          if (confirm) deleteScheduleDay(deleteScheduleDayId);
          setDeleteScheduleDayId(0);
        }}
      />
    </div>
  );
};
ScheduleDayList.getLayout = getLayout;
export default ScheduleDayList;
