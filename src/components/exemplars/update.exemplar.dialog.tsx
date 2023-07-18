import { useState } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";

import { ApiErrorMessage, Button, IconButton, toast } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import { Form, Input, ValidationSummary, setFormErrors, useForm } from "~/components/forms";
import { type HandleCloseProps } from "~/lib/common";
import { type UpdateExemplarInput, updateExemplarSchema } from "~/lib/schemas/exemplar";
import { type ExemplarInfo } from "~/server/api/routers/exemplar";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateExemplarDialogProps = HandleCloseProps<
  RouterOutputs["exemplar"]["updateExemplar"]["exemplar"]
> & {
  exemplar: ExemplarInfo;
};

const UpdateExemplarDialog = ({ exemplar, handleClose }: UpdateExemplarDialogProps) => {
  const apiContext = api.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const {
    mutate: updateExemplar,
    isLoading,
    error: apiError,
  } = api.exemplar.updateExemplar.useMutation({
    onSuccess(data) {
      handleClose(data.exemplar);
      apiContext.exemplar.invalidate();
      toast.success("Exemplar updated successfully");
    },
    onError(error) {
      const zodError = error.data?.zodError;
      if (zodError) setFormErrors(form, zodError);
      else toast.error(error.message);
    },
  });

  const { mutate: deleteExemplar } = api.exemplar.deleteExemplar.useMutation({
    onSuccess() {
      apiContext.exemplar.invalidate();
      toast.success("Exemplar deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({ schema: updateExemplarSchema.shape.data, defaultValues: exemplar });

  const handleSubmit = (data: UpdateExemplarInput["data"]) => {
    updateExemplar({ id: exemplar.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update Exemplar" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} />
            <Input label="Category" {...form.register("category")} />
            <Input label="Content" {...form.register("content")} />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className={styles.actions}>
          <Button onClick={() => handleClose()} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-3 flex-1"
            isLoading={isLoading}
            disabled={!form.formState.isDirty || !form.formState.isValid}>
            Update
          </Button>
        </div>
      </Form>
      <ConfirmDelete
        open={openDelete}
        handleClose={(confirm) => {
          if (confirm) {
            deleteExemplar(exemplar.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete exemplar"
        description="Are you sure you want to delete this exemplar? This action cannot be undone."
      />
    </>
  );
};

export default UpdateExemplarDialog;
