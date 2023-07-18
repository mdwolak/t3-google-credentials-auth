import { useEffect } from "react";

import { ApiErrorMessage, Button } from "~/components/core";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import { Form, Input, ValidationSummary, useForm } from "~/components/forms";
import { useCrud } from "~/components/hooks/useCrud";
import { type HandleCloseProps } from "~/lib/common";
import { type CreateExemplarInput, createExemplarSchema } from "~/lib/schemas/exemplar";
import { type RouterOutputs } from "~/utils/api";

const CreateExemplarDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["exemplar"]["create"]>) => {
  const form = useForm({
    schema: createExemplarSchema,

    defaultValues: {
      name: "name", //router.query.email
      category: "category",
      content: "content",
      published: true,
    },
  });
  const { setFocus } = form;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const { getCreateMutation } = useCrud({
    path: "exemplar",
    name: "Exemplar",
    form,
  });
  const { mutate: createExemplar, isLoading, error: apiError } = getCreateMutation({ handleClose });

  const handleSubmit = (data: CreateExemplarInput) => {
    createExemplar(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create Exemplar"
            subtitle="Get started by filling in the information below to create your new exemplar."
            handleClose={handleClose}
          />
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

export default CreateExemplarDialog;
