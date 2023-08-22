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
import { type HandleCloseProps } from "~/lib/common";
import { type CreateActivityInput, createActivitySchema } from "~/lib/schemas/activity";
import { type RouterOutputs, api } from "~/utils/api";

const CreateActivityDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["activity"]["create"]["activity"]>) => {
  const apiContext = api.useContext();

  const form = useForm({
    schema: createActivitySchema,

    defaultValues: {
      name: "name", //router.query.email
      description: "description",
      addressId: 0,
      duration: 30,
      visible: true,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createActivity,
    isLoading,
    error: apiError,
  } = api.activity.create.useMutation({
    onSuccess(data) {
      handleClose(data.activity);
      apiContext.activity.invalidate();
      toast.success("Activity created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleSubmit = (data: CreateActivityInput) => {
    createActivity(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create Activity"
            subtitle="Get started by filling in the information below to create your new activity."
            handleClose={handleClose}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} />
            <Input label="Description" {...form.register("description")} />
            <Input label="AddressId" {...form.register("addressId")} type="number" />
            <Input label="Duration" {...form.register("duration")} type="number" />
            <Input label="Visible" {...form.register("visible")} type="checkbox" />
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
    </>
  );
};

export default CreateActivityDialog;
