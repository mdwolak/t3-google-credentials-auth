import { useEffect } from "react";

import { ApiErrorMessage, Button, toast } from "~/components/core";
import { OpenDialogProps, SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import { Form, Input, ValidationSummary, setFormErrors, useForm } from "~/components/forms";
import { type UpdateExemplarInput, updateExemplarSchema } from "~/lib/schemas/exemplar";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateExemplarProps = OpenDialogProps & {
  exemplar: RouterOutputs["exemplar"]["getExemplars"]["exemplars"][0];
};

const UpdateExemplarDialog = ({ exemplar, setOpen }: UpdateExemplarProps) => {
  const apiContext = api.useContext();

  const {
    mutate: updateExemplar,
    isLoading,
    error: apiError,
  } = api.exemplar.updateExemplar.useMutation({
    onSuccess() {
      setOpen(false);
      apiContext.exemplar.invalidate();
      toast.success("Exemplar updated successfully");
    },
    onError(error) {
      const zodError = error.data?.zodError;
      if (zodError) setFormErrors(form, zodError);
      else toast.error(error.message);
    },
  });

  const form = useForm({ schema: updateExemplarSchema.shape.data });

  useEffect(() => {
    if (exemplar) {
      form.reset(exemplar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            setOpen={setOpen}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Title" {...form.register("title")} />
            <Input label="Category" {...form.register("category")} />
            <Input label="Content" {...form.register("content")} />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className={styles.actions}>
          <Button onClick={() => setOpen(false)} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="ml-3 flex-1" isLoading={isLoading}>
            Update
          </Button>
        </div>
      </Form>
    </>
  );
};

export default UpdateExemplarDialog;
