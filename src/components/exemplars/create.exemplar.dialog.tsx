import { ApiErrorMessage, Button, toast } from "~/components/core";
import { OpenDialogProps, SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import { Form, Input, ValidationSummary, setFormErrors, useForm } from "~/components/forms";
import { type CreateExemplarInput, createExemplarSchema } from "~/lib/schemas/exemplar";
import { api } from "~/utils/api";

const CreateExemplarDialog = ({ setOpen }: OpenDialogProps) => {
  const apiContext = api.useContext();

  const form = useForm({
    schema: createExemplarSchema,
    //TODO: remove
    defaultValues: {
      title: "title", //router.query.email
      category: "category",
      content: "content",
      published: true,
    },
  });

  const {
    mutate: createExemplar,
    isLoading,
    error: apiError,
  } = api.exemplar.createExemplar.useMutation({
    onSuccess() {
      setOpen(false);
      apiContext.exemplar.invalidate();
      toast.success("Exemplar created successfully");
    },
    onError(error) {
      const zodError = error.data?.zodError;
      if (zodError) setFormErrors(form, zodError);
      else toast.error(error.message);
    },
  });

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
            Create
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateExemplarDialog;
