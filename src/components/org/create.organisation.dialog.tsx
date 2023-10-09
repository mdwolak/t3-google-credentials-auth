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
import {
  type CreateOrganisationInput,
  createOrganisationSchema,
} from "~/lib/schemas/organisation.schema";
import { type RouterOutputs, api } from "~/utils/api";

const CreateOrganisationDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["organisation"]["create"]["organisation"]>) => {
  const apiContext = api.useContext();

  const form = useForm({
    schema: createOrganisationSchema,

    defaultValues: {
      //parentId
      name: "name",
      description: "description",
      //type: ,
      visible: true,
      //status: true,
      //position: 0,
      //data: true,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createOrganisation,
    isLoading,
    error: apiError,
  } = api.organisation.create.useMutation({
    onSuccess(data) {
      handleClose(data.organisation);
      apiContext.organisation.invalidate();
      toast.success("Organisation created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleSubmit = (data: CreateOrganisationInput) => {
    createOrganisation(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create Organisation"
            subtitle="Get started by filling in the information below to create your new organisation."
            handleClose={handleClose}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} required />
            <Input label="Description" {...form.register("description")} required />
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

export default CreateOrganisationDialog;
