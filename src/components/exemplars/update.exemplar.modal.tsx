import { useEffect } from "react";

import { Button, type OpenModalProps, toast } from "~/components/core";
import { Form, Input, setFormErrors, useForm } from "~/components/forms";
import { type UpdateExemplarInput, updateExemplarSchema } from "~/lib/schemas/exemplar";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateExemplarProps = OpenModalProps & {
  exemplar: RouterOutputs["exemplar"]["getExemplars"]["exemplars"][0];
};

const UpdateExemplarModal = ({ exemplar, setOpenModal }: UpdateExemplarProps) => {
  const apiContext = api.useContext();

  const { isLoading, mutate: updateExemplar } = api.exemplar.updateExemplar.useMutation({
    onSuccess() {
      setOpenModal(false);
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
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Update Exemplar</h2>
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
            Update Exemplar
          </Button>
        </fieldset>
      </Form>
    </section>
  );
};

export default UpdateExemplarModal;
