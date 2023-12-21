import { useState } from "react";

import toast from "react-hot-toast";

import { FormattedDate } from "~/components/core";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { type ActivityInfo } from "~/server/api/routers/activity.router";
import { api } from "~/utils/api";

import UpdateActivityDialog from "./update.activity.dialog";

type ActivityItemProps = {
  activity: ActivityInfo;
};

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const apiUtils = api.useUtils();
  const [selectedActivity, setSelectedActivity] = useState<ActivityInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteActivity } = api.activity.delete.useMutation({
    onSuccess() {
      apiUtils.activity.invalidate();
      toast.success("Activity deleted successfully");
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
      deleteActivity(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">
            {activity.name.length > 25 ? activity.name.substring(0, 25) + "..." : activity.name}
          </h5>
          <div className="mt-4 flex items-center">
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">{activity.duration}</p>
            <p className="text-[#ffa238]">
              <FormattedDate date={activity.createdAt} />
            </p>
          </div>
          <div className="mt-4">{activity.description}</div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setSelectedActivity(activity);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(activity.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      {selectedActivity && (
        <SlideOver open={true} onClose={() => setSelectedActivity(null)}>
          <UpdateActivityDialog
            activity={selectedActivity}
            handleClose={() => setSelectedActivity(null)}
          />
        </SlideOver>
      )}
    </>
  );
};

export default ActivityItem;
