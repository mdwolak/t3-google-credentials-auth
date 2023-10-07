import { useState } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";

import { ApiErrorMessage, Button, FormattedDate, IconButton, toast } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import {
  Form,
  Input,
  RadioGroup,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import {
  type HandleCloseProps,
  dateToInputTime,
  stripNullishProps,
  weekDaysOptions,
} from "~/lib/common";
import {
  type UpdateScheduleDayInput,
  updateScheduleDaySchema,
} from "~/lib/schemas/scheduleDay.schema";
import { type ScheduleDayInfo } from "~/server/api/routers/scheduleDay.router";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateScheduleDayDialogProps = HandleCloseProps<
  RouterOutputs["scheduleDay"]["update"]["scheduleDay"]
> & {
  scheduleDay: ScheduleDayInfo;
};

const UpdateScheduleDayDialog = ({ scheduleDay, handleClose }: UpdateScheduleDayDialogProps) => {
  const apiContext = api.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteScheduleDay } = api.scheduleDay.delete.useMutation({
    onSuccess() {
      apiContext.scheduleDay.invalidate();
      toast.success("ScheduleDay deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  console.log(scheduleDay);

  const form = useForm({
    schema: updateScheduleDaySchema.shape.data,
    defaultValues: {
      ...stripNullishProps(scheduleDay),
      startTime: dateToInputTime(scheduleDay?.startTime ?? undefined),
    },
  });

  const {
    mutate: updateScheduleDay,
    isLoading,
    error: apiError,
  } = api.scheduleDay.update.useMutation({
    onSuccess(data) {
      handleClose(data.scheduleDay);
      apiContext.scheduleDay.invalidate();
      toast.success("ScheduleDay updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateScheduleDayInput["data"]) => {
    updateScheduleDay({ id: scheduleDay.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update ScheduleDay" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <RadioGroup
              control={form.control}
              label="What day is the activity on? "
              options={weekDaysOptions}
              name="dayOfWeek"
              style="SmallCards"
              containerClass="grid grid-cols-7 gap-2"
            />
            <Input
              label="What time does it start at?"
              {...form.register("startTime")}
              type="time"
            />
            <Input label="How many minutes?" {...form.register("duration")} />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!form.formState.isDirty || !form.formState.isValid}>
            Save
          </Button>
        </div>
      </Form>
      <ConfirmDelete
        open={openDelete}
        handleClose={(confirm) => {
          if (confirm) {
            deleteScheduleDay(scheduleDay.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete scheduleDay"
        description="Are you sure you want to delete this scheduleDay? This action cannot be undone."
      />
    </>
  );
};

export default UpdateScheduleDayDialog;
