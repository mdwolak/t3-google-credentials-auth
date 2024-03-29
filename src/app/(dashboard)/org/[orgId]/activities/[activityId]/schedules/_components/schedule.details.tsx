import { useState } from "react";

import toast from "react-hot-toast";

import { FormattedDate } from "~/components/core";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { type ScheduleInfo } from "~/server/api/routers/schedule.router";
import { api } from "~/trpc/client";

import UpdateScheduleDialog from "./update.schedule.dialog";

type ScheduleItemProps = {
  schedule: ScheduleInfo;
};

const ScheduleItem = ({ schedule }: ScheduleItemProps) => {
  const apiUtils = api.useUtils();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteSchedule } = api.schedule.delete.useMutation({
    onSuccess() {
      apiUtils.schedule.invalidate();
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
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">
              <FormattedDate date={schedule.startDate} />
            </p>
            <p className="text-[#ffa238]">
              <FormattedDate date={schedule.createdAt} />
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
