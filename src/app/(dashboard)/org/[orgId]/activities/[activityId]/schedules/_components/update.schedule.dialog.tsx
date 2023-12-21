import { useState } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";

import { ApiErrorMessage, Button, IconButton, toast } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import {
  Form,
  Input,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type HandleCloseProps, dateToInputDate } from "~/lib/common";
import { type UpdateScheduleInput, updateScheduleSchema } from "~/lib/schemas/schedule.schema";
import { type ScheduleInfo } from "~/server/api/routers/schedule.router";
import { type RouterOutputs, api } from "~/trpc/client";

type UpdateScheduleDialogProps = HandleCloseProps<
  RouterOutputs["schedule"]["update"]["schedule"]
> & {
  schedule: ScheduleInfo;
};

const UpdateScheduleDialog = ({ schedule, handleClose }: UpdateScheduleDialogProps) => {
  const apiUtils = api.useUtils();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteSchedule } = api.schedule.delete.useMutation({
    onSuccess() {
      apiUtils.schedule.invalidate();
      toast.success("Schedule deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: updateScheduleSchema.shape.data,
    defaultValues: {
      name: schedule?.name || "",
      startDate: dateToInputDate(schedule?.startDate),
      endDate: dateToInputDate(schedule?.endDate ?? undefined),
    },
  });

  const {
    mutate: updateSchedule,
    isLoading,
    error: apiError,
  } = api.schedule.update.useMutation({
    onSuccess(data) {
      handleClose(data.schedule);
      apiUtils.schedule.invalidate();
      toast.success("Schedule updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateScheduleInput["data"]) => {
    updateSchedule({ id: schedule.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update Schedule" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} />
            <Input label="Start Date" {...form.register("startDate")} type="date" required />
            <Input label="End Date" {...form.register("endDate")} type="date" />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className={styles.actions}>
          <Button type="submit" fullWidth isLoading={isLoading} disabled={!form.formState.isDirty}>
            Save
          </Button>
        </div>
      </Form>
      <ConfirmDelete
        open={openDelete}
        handleClose={(confirm) => {
          if (confirm) {
            deleteSchedule(schedule.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
      />
    </>
  );
};

export default UpdateScheduleDialog;
