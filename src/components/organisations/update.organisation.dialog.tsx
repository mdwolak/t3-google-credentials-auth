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
import {
  type UpdateOrganisationInput,
  updateOrganisationSchema,
} from "~/lib/schemas/organisation.schema";
import { type OrganisationInfo } from "~/server/api/routers/organisation.router";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateOrganisationDialogProps = HandleCloseProps<
  RouterOutputs["organisation"]["update"]["organisation"]
> & {
  organisation: OrganisationInfo;
};

const UpdateOrganisationDialog = ({ organisation, handleClose }: UpdateOrganisationDialogProps) => {
  const apiContext = api.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteOrganisation } = api.organisation.delete.useMutation({
    onSuccess() {
      apiContext.organisation.invalidate();
      toast.success("Organisation deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: updateOrganisationSchema.shape.data,
    defaultValues: stripNullishProps(organisation),
  });

  const {
    mutate: updateOrganisation,
    isLoading,
    error: apiError,
  } = api.organisation.update.useMutation({
    onSuccess(data) {
      handleClose(data.organisation);
      apiContext.organisation.invalidate();
      toast.success("Organisation updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateOrganisationInput["data"]) => {
    updateOrganisation({ id: organisation.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update Organisation" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} />
            <Input label="Description" {...form.register("description")} />
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
            deleteOrganisation(organisation.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete organisation"
        description="Are you sure you want to delete this organisation? This action cannot be undone."
      />
    </>
  );
};

export default UpdateOrganisationDialog;
