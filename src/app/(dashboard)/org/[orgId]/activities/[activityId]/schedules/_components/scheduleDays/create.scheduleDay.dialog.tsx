import { useEffect, useMemo } from "react";

import { ApiErrorMessage, Button, toast } from "~/components/core";
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
import { type HandleCloseProps, weekDaysOptions } from "~/lib/common";
import {
  type CreateScheduleDayInput,
  createScheduleDaySchema,
} from "~/lib/schemas/scheduleDay.schema";
import { type ScheduleInfo } from "~/server/api/routers/schedule.router";
import { type RouterOutputs, api } from "~/trpc/client";

const CreateScheduleDayDialog = ({
  schedule,
  handleClose,
}: HandleCloseProps<RouterOutputs["scheduleDay"]["create"]["scheduleDay"]> & {
  schedule: ScheduleInfo;
}) => {
  const apiUtils = api.useUtils();

  const form = useForm({
    schema: createScheduleDaySchema,

    defaultValues: {
      dayOfWeek: 0,
      scheduleId: schedule?.id,
      duration: 60,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createScheduleDay,
    isLoading,
    error: apiError,
  } = api.scheduleDay.create.useMutation({
    onSuccess(data) {
      handleClose(data.scheduleDay);
      apiUtils.schedule.invalidate();
      toast.success("ScheduleDay created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("dayOfWeek");
  }, [setFocus]);

  const mWeekDaysOptions = useMemo(() => {
    return weekDaysOptions.map((o) => {
      const isDisabled = schedule?.scheduleDays.some((sd) => sd.dayOfWeek === o.value);
      return { ...o, disabled: isDisabled };
    });
  }, [schedule?.scheduleDays]);

  const handleSubmit = (data: CreateScheduleDayInput) => {
    createScheduleDay(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create ScheduleDay"
            subtitle="Get started by filling in the information below to create your new scheduleDay."
            handleClose={handleClose}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <RadioGroup
              control={form.control}
              label="What day is the activity on? "
              options={mWeekDaysOptions}
              name="dayOfWeek"
              style="SmallCards"
              containerClass="grid grid-cols-7 gap-2"
              required
            />
            <Input
              label="What time does it start at?"
              {...form.register("startTime")}
              type="time"
              required
            />
            <Input label="Duration" {...form.register("duration")} type="number" required />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className={styles.actions}>
          <Button type="submit" fullWidth isLoading={isLoading} disabled={!form.formState.isDirty}>
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateScheduleDayDialog;
