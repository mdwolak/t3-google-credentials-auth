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
import { type CreateUserInput, createUserSchema } from "~/lib/schemas/user.schema";
import { type RouterOutputs, api } from "~/trpc/client";

const CreateUserDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["user"]["create"]["user"]>) => {
  const apiUtils = api.useUtils();

  const form = useForm({
    schema: createUserSchema,

    defaultValues: {
      name: "name", //router.query.email
      email: "content",
      //orgId: 1,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createUser,
    isLoading,
    error: apiError,
  } = api.user.create.useMutation({
    onSuccess(data) {
      handleClose(data.user);
      apiUtils.user.invalidate();
      toast.success("User created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleSubmit = (data: CreateUserInput) => {
    createUser(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create User"
            subtitle="Get started by filling in the information below to create your new user."
            handleClose={handleClose}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} required />
            <Input label="Email" {...form.register("email")} required />
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

export default CreateUserDialog;
