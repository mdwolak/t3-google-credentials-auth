import { useRouter } from "next/router";
import { useEffect } from "react";

import { Controller } from "react-hook-form";

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
import { type HandleCloseProps } from "~/lib/common";
import { type CreateActivityInput, createActivitySchema } from "~/lib/schemas/activity.schema";
import { type RouterOutputs, api } from "~/utils/api";

const CreateActivityDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["activity"]["create"]["activity"]>) => {
  const apiContext = api.useContext();
  const router = useRouter();
  const organisationId = Number(router.query.organisationId);

  const form = useForm({
    schema: createActivitySchema,

    defaultValues: {
      name: "name", //router.query.email
      description: "description",
      duration: 30,
      visible: true,
      organisationId,
      addressId: 0,
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

  const { data: addressOptions, isLoading: isLoadingAddresses } = api.address.getFiltered.useQuery(
    { organisationId },
    {
      select: (data) =>
        data.addresses.map((address) => ({
          name: `${address.postcode}`,
          description: `${address.line1}, ${address.line2}, ${address.city}, ${address.county}`,
          value: address.id,
        })),
      onError(error) {
        toast.error(error.message);
      },
    }
  );

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
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading || isLoadingAddresses}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            {!addressOptions || addressOptions.length === 0 ? (
              <div className="text-center">No addresses found, please add one first.</div>
            ) : (
              <Controller
                name="addressId"
                control={form.control}
                rules={{
                  required: "Please select an address",
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <RadioGroup
                    options={addressOptions}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={form.formState.errors.addressId}
                  />
                )}
              />
            )}
            <Input label="Name" {...form.register("name")} />
            <Input label="Description" {...form.register("description")} />
            <Input label="Duration" {...form.register("duration")} type="number" />
            <Input label="Visible" {...form.register("visible")} type="checkbox" />
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

export default CreateActivityDialog;
