import { useRouter } from "next/router";
import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TableCaption } from "~/components/Table";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { getLayout } from "~/components/layouts/Layout";
import CreateScheduleDayDialog from "~/components/scheduleDays/create.scheduleDay.dialog";
import UpdateScheduleDayDialog from "~/components/scheduleDays/update.scheduleDay.dialog";
import { formatTime, groupArrayByObjectProperty, weekDays } from "~/lib/common";
import { type ScheduleDayInfo } from "~/server/api/routers/scheduleDay.router";
import { api } from "~/utils/api";

const ScheduleDayList = () => {
  const apiContext = api.useContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateScheduleDay, setUpdateScheduleDay] = useState<ScheduleDayInfo | null>(null);
  const [deleteScheduleDayId, setDeleteScheduleDayId] = useState<number>(0);

  const router = useRouter();
  const scheduleId = Number(router.query.scheduleId);

  const { data: scheduleDaysByDayOfWeek } = api.scheduleDay.getByScheduleId.useQuery(scheduleId, {
    enabled: !!scheduleId,
    select: (data) =>
      groupArrayByObjectProperty(data?.scheduleDays, (scheduleDay) => scheduleDay.dayOfWeek),
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
        {scheduleDaysByDayOfWeek &&
          Object.entries(scheduleDaysByDayOfWeek).map(([dayOfWeek, scheduleDays]) => (
            <div key={dayOfWeek} className="flex flex-wrap gap-x-6 gap-y-4">
              <span>{weekDays[parseInt(dayOfWeek)]}</span>
              {scheduleDays.map((scheduleDay) => (
                <span
                  key={scheduleDay.id}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {formatTime(scheduleDay.startTime)}
                </span>
              ))}
            </div>
          ))}
        {(!scheduleDaysByDayOfWeek || Object.keys(scheduleDaysByDayOfWeek).length === 0) && (
          <Message>There are no scheduleDays at the moment</Message>
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
