import { ApiErrorMessage, Button, toast } from "~/components/core";
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
          <SlideOverHeader
            title="Update Exemplar"
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
          <Button onClick={() => handleClose()} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-3 flex-1"
            isLoading={isLoading}
            disabled={!form.formState.isDirty}>
            Update
          </Button>
        </div>
      </Form>
    </>
  );
};

export default UpdateExemplarDialog;
