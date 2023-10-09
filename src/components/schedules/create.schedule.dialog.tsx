import { useEffect } from "react";

import { ApiErrorMessage, Button, toast } from "~/components/core";
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
import { type CreateScheduleInput, createScheduleSchema } from "~/lib/schemas/schedule.schema";
import { type RouterOutputs, api } from "~/utils/api";

const CreateScheduleDialog = ({
  activityId,
  handleClose,
}: HandleCloseProps<RouterOutputs["schedule"]["create"]["schedule"]> & {
  activityId: number;
}) => {
  const apiContext = api.useContext();

  const form = useForm({
    schema: createScheduleSchema,

    defaultValues: {
      name: "name", //router.query.email
      startDate: dateToInputDate(new Date()),
      endDate: dateToInputDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
      activityId,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createSchedule,
    isLoading,
    error: apiError,
  } = api.schedule.create.useMutation({
    onSuccess(data) {
      handleClose(data.schedule);
      apiContext.schedule.invalidate();
      toast.success("Schedule created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleSubmit = (data: CreateScheduleInput) => {
    createSchedule(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create Schedule"
            subtitle="Get started by filling in the information below to create your new schedule."
            handleClose={handleClose}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} required />
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
    </>
  );
};

export default CreateScheduleDialog;
