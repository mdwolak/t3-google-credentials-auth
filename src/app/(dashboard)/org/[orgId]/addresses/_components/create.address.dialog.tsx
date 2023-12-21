import { useParams } from "next/navigation";
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
import { type CreateAddressInput, createAddressSchema } from "~/lib/schemas/address.schema";
import { type RouterOutputs, api } from "~/trpc/client";

const CreateAddressDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["address"]["create"]["address"]>) => {
  const apiUtils = api.useUtils();
  const params = useParams();
  const orgId = Number(params?.orgId);

  const form = useForm({
    schema: createAddressSchema,

    defaultValues: {
      line1: "line 1",
      line2: "line 2",
      city: "city",
      county: "county",
      postcode: "postcode",
      orgId,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createAddress,
    isLoading,
    error: apiError,
  } = api.address.create.useMutation({
    onSuccess(data) {
      handleClose(data.address);
      apiUtils.address.invalidate();
      toast.success("Address created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("postcode");
  }, [setFocus]);

  const handleSubmit = (data: CreateAddressInput) => {
    createAddress(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create Address"
            subtitle="Get started by filling in the information below to create your new address."
            handleClose={handleClose}
          />
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
    </>
  );
};

export default CreateAddressDialog;
