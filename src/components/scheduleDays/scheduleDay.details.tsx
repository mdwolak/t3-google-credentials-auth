import { useState } from "react";

import toast from "react-hot-toast";

import { FormattedDate } from "~/components/core";
import { SlideOver } from "~/components/dialogs/SlideOver";
import UpdateScheduleDayDialog from "~/components/scheduleDays/update.scheduleDay.dialog";
import { type ScheduleDayInfo } from "~/server/api/routers/scheduleDay.router";
import { api } from "~/utils/api";

type ScheduleDayItemProps = {
  scheduleDay: ScheduleDayInfo;
};

const ScheduleDayItem = ({ scheduleDay }: ScheduleDayItemProps) => {
  const apiContext = api.useContext();
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<ScheduleDayInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteScheduleDay } = api.scheduleDay.delete.useMutation({
    onSuccess() {
      apiContext.scheduleDay.invalidate();
      toast.success("ScheduleDay deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const onDeleteHandler = (id: number) => {
    toggleMenu();
    if (window.confirm("Are you sure")) {
      deleteScheduleDay(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">{scheduleDay.dayOfWeek}</h5>
          <div className="mt-4 flex items-center">
            <p className="text-[#ffa238]">
              <FormattedDate date={scheduleDay.startTime} />
            </p>
          </div>
          <div className="mt-4">{scheduleDay.duration}</div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setSelectedScheduleDay(scheduleDay);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(scheduleDay.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      {selectedScheduleDay && (
        <SlideOver open={true} onClose={() => setSelectedScheduleDay(null)}>
          <UpdateScheduleDayDialog
            scheduleDay={selectedScheduleDay}
            handleClose={() => setSelectedScheduleDay(null)}
          />
        </SlideOver>
      )}
    </>
  );
};

export default ScheduleDayItem;
