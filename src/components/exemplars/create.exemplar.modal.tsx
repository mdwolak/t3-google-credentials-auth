import { ApiErrorMessage, Button, type OpenModalProps, toast } from "~/components/core";
import { Form, Input, ValidationSummary, setFormErrors, useForm } from "~/components/forms";
import { type CreateExemplarInput, createExemplarSchema } from "~/lib/schemas/exemplar";
import { api } from "~/utils/api";

const CreateExemplarModal = ({ setOpenModal }: OpenModalProps) => {
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
      setOpenModal(false);
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
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Create Exemplar</h2>

      <ValidationSummary errors={form.formState.errors} />
      <ApiErrorMessage error={apiError} visible={form.formState.isValid} />
      <Form form={form} handleSubmit={handleSubmit} className="w-full">
        <fieldset className="space-y-6" disabled={isLoading}>
          <Input label="Title" {...form.register("title")} />
          <Input label="Category" {...form.register("category")} />
          <Input label="Content" {...form.register("content")} />
          <div className="mb-2 flex items-center">
            <input
              id="checked-checkbox"
              type="checkbox"
              value=""
              {...form.register("published")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
            <label
              htmlFor="checked-checkbox"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Published
            </label>
          </div>
          <Button type="submit" isLoading={isLoading}>
            Create Exemplar
          </Button>
        </fieldset>
      </Form>
    </section>
  );
};

export default CreateExemplarModal;
