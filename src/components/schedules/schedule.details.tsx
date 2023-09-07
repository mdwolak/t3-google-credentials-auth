import { useState } from "react";

import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

import { SlideOver } from "~/components/dialogs/SlideOver";
import UpdateScheduleDialog from "~/components/schedules/update.schedule.dialog";
import { type ScheduleInfo } from "~/server/api/routers/schedule.router";
import { api } from "~/utils/api";

type ScheduleItemProps = {
  schedule: ScheduleInfo;
};

const ScheduleItem = ({ schedule }: ScheduleItemProps) => {
  const apiContext = api.useContext();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteSchedule } = api.schedule.delete.useMutation({
    onSuccess() {
      apiContext.schedule.invalidate();
      toast.success("Schedule deleted successfully");
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
      deleteSchedule(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">
            {schedule.name && schedule.name.length > 25
              ? schedule.name.substring(0, 25) + "..."
              : schedule.name}
          </h5>
          <div className="mt-4 flex items-center">
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">{format(schedule.startDate, "PPP")}</p>
            <p className="text-[#ffa238]">
              {format(parseISO(schedule.createdAt.toISOString()), "PPP")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setSelectedSchedule(schedule);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(schedule.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      {selectedSchedule && (
        <SlideOver open={true} onClose={() => setSelectedSchedule(null)}>
          <UpdateScheduleDialog
            schedule={selectedSchedule}
            handleClose={() => setSelectedSchedule(null)}
          />
        </SlideOver>
      )}
    </>
  );
};

export default ScheduleItem;
