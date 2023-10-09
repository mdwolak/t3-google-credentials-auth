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
import { type UpdateAddressInput, updateAddressSchema } from "~/lib/schemas/address.schema";
import { type AddressInfo } from "~/server/api/routers/address.router";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateAddressDialogProps = HandleCloseProps<RouterOutputs["address"]["update"]["address"]> & {
  address: AddressInfo;
};

const UpdateAddressDialog = ({ address, handleClose }: UpdateAddressDialogProps) => {
  const apiContext = api.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteAddress } = api.address.delete.useMutation({
    onSuccess() {
      apiContext.address.invalidate();
      toast.success("Address deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: updateAddressSchema.shape.data,
    defaultValues: stripNullishProps(address),
  });

  const {
    mutate: updateAddress,
    isLoading,
    error: apiError,
  } = api.address.update.useMutation({
    onSuccess(data) {
      handleClose(data.address);
      apiContext.address.invalidate();
      toast.success("Address updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateAddressInput["data"]) => {
    updateAddress({ id: address.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update Address" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Line 1" {...form.register("line1")} required />
            <Input label="Line 2" {...form.register("line2")} />
            <Input label="City" {...form.register("city")} required />
            <Input label="County" {...form.register("county")} />
            <Input label="Postcode" {...form.register("postcode")} required />
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
            deleteAddress(address.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      />
    </>
  );
};

export default UpdateAddressDialog;
