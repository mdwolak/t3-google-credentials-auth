import { useParams } from "next/navigation";
import { useEffect } from "react";

import { ApiErrorMessage, Button, toast } from "~/components/core";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import {
  Checkbox,
  Form,
  Input,
  RadioGroup,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type HandleCloseProps } from "~/lib/common";
import { type CreateActivityInput, createActivitySchema } from "~/lib/schemas/activity.schema";
import { type RouterOutputs, api } from "~/trpc/client";

const CreateActivityDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["activity"]["create"]["activity"]>) => {
  const apiUtils = api.useUtils();
  const params = useParams();
  const orgId = Number(params?.orgId);

  const form = useForm({
    schema: createActivitySchema,

    defaultValues: {
      name: "name", //router.query.email
      description: "description",
      duration: 30,
      visible: true,
      orgId,
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
      apiUtils.activity.invalidate();
      toast.success("Activity created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const { data: addressOptions, isLoading: isLoadingAddresses } = api.address.getFiltered.useQuery(
    { orgId },
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
    },
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

            <Input label="Name" {...form.register("name")} required />
            <Input label="Description" {...form.register("description")} required />

            {!addressOptions?.length ? (
              <div className="text-center">No addresses found, please add one first.</div>
            ) : (
              <RadioGroup
                label="Address"
                name="addressId"
                control={form.control}
                options={addressOptions}
                required
              />
            )}
            <Input label="Duration" {...form.register("duration")} type="number" required />
            <Checkbox
              label="Make visible to Public"
              {...form.register("visible")}
              description="This activity will be visible to all users."
            />
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
