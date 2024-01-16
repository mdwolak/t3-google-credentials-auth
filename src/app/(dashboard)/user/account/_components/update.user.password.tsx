"use client";

import { ApiErrorMessage, Button, toast } from "~/components/core";
import {
  Form,
  InputPassword,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { TwoColumnPanel } from "~/components/sections/TwoColumnPanel";
import { type ChangePasswordInput, changePasswordSchema } from "~/lib/schemas/user.schema";
import { api } from "~/trpc/client";

const UpdateUserPassword = ({ userId }: { userId: number }) => {
  const form = useForm({
    schema: changePasswordSchema.shape.data,
  });

  const {
    mutate: updateUser,
    isLoading,
    error: apiError,
  } = api.user.changePassword.useMutation({
    onSuccess() {
      toast.success("User updated successfully");
      form.reset({}, { keepValues: true });
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: ChangePasswordInput["data"]) => {
    updateUser({ id: userId, data });
  };

  return (
    <>
      <TwoColumnPanel
        title="Change password"
        description="Update your password associated with your account."
        disabled={isLoading}>
        <Form form={form} handleSubmit={handleSubmit} className="md:col-span-2">
          <TwoColumnPanel.Content>
            <ValidationSummary errors={form.formState.errors} className="sm:col-span-full" />
            <ApiErrorMessage
              error={apiError}
              visible={form.formState.isValid}
              className="sm:col-span-full"
            />
            <div className="sm:col-span-full">
              <InputPassword
                label="Current password"
                {...form.register("oldPassword")}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="sm:col-span-full">
              <InputPassword
                label="New password"
                {...form.register("password")}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="sm:col-span-full">
              <InputPassword
                label="Confirm password"
                {...form.register("passwordConfirm")}
                autoComplete="new-password"
                required
              />
            </div>
          </TwoColumnPanel.Content>

          <div className="mt-8 flex">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!form.formState.isDirty || !form.formState.isValid}
              className="w-32">
              Save
            </Button>
          </div>
        </Form>
      </TwoColumnPanel>
    </>
  );
};

export default UpdateUserPassword;
