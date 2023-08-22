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
import { type HandleCloseProps, stripNullishProps } from "~/lib/common";
import { type UpdateActivityInput, updateActivitySchema } from "~/lib/schemas/activity";
import { type ActivityInfo } from "~/server/api/routers/activity";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateActivityDialogProps = HandleCloseProps<
  RouterOutputs["activity"]["update"]["activity"]
> & {
  activity: ActivityInfo;
};

const UpdateActivityDialog = ({ activity, handleClose }: UpdateActivityDialogProps) => {
  const apiContext = api.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteActivity } = api.activity.delete.useMutation({
    onSuccess() {
      apiContext.activity.invalidate();
      toast.success("Activity deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: updateActivitySchema.shape.data,
    defaultValues: stripNullishProps(activity),
  });

  const {
    mutate: updateActivity,
    isLoading,
    error: apiError,
  } = api.activity.update.useMutation({
    onSuccess(data) {
      handleClose(data.activity);
      apiContext.activity.invalidate();
      toast.success("Activity updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateActivityInput["data"]) => {
    updateActivity({ id: activity.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update Activity" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
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
      <ConfirmDelete
        open={openDelete}
        handleClose={(confirm) => {
          if (confirm) {
            deleteActivity(activity.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete activity"
        description="Are you sure you want to delete this activity? This action cannot be undone."
      />
    </>
  );
};

export default UpdateActivityDialog;
