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
import { type UpdateUserInput, updateUserSchema } from "~/lib/schemas/user.schema";
import { type UserInfo } from "~/server/api/routers/user.router";
import { type RouterOutputs, api } from "~/trpc/client";

type UpdateUserDialogProps = HandleCloseProps<RouterOutputs["user"]["update"]["user"]> & {
  user: UserInfo;
};

const UpdateUserDialog = ({ user, handleClose }: UpdateUserDialogProps) => {
  const apiUtils = api.useUtils();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteUser } = api.user.delete.useMutation({
    onSuccess() {
      apiUtils.user.invalidate();
      toast.success("User deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: updateUserSchema.shape.data,
    defaultValues: stripNullishProps(user),
  });

  const {
    mutate: updateUser,
    isLoading,
    error: apiError,
  } = api.user.update.useMutation({
    onSuccess(data) {
      handleClose(data.user);
      apiUtils.user.invalidate();
      toast.success("User updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateUserInput["data"]) => {
    updateUser({ id: user.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update User" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} required />
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
            deleteUser(user.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete user"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </>
  );
};

export default UpdateUserDialog;
