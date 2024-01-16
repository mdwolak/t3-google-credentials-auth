"use client";

import { ApiErrorMessage, Button, toast } from "~/components/core";
import {
  Form,
  Input,
  InputEmail,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { TwoColumnPanel } from "~/components/sections/TwoColumnPanel";
import { stripNullishProps } from "~/lib/common";
import { type UpdateUserInput, updateUserSchema } from "~/lib/schemas/user.schema";
import { type UserInfo } from "~/server/api/routers/user.router";
import { api } from "~/trpc/client";

type UpdateUserProfileProps = {
  user: UserInfo;
};
const UpdateUserProfile = ({ user }: UpdateUserProfileProps) => {
  const apiUtils = api.useUtils();

  const form = useForm({
    schema: updateUserSchema.shape.data,
    defaultValues: stripNullishProps(user),
  });

  const {
    mutate: updateUser,
    isLoading,
    error: apiError,
  } = api.user.update.useMutation({
    onSuccess() {
      apiUtils.user.invalidate();
      toast.success("User updated successfully");
      form.reset({}, { keepValues: true });
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateUserInput["data"]) => {
    updateUser({ id: user.id, data });
  };

  return (
    <>
      <TwoColumnPanel title="Personal Information" disabled={isLoading}>
        <Form form={form} handleSubmit={handleSubmit} className="md:col-span-2">
          <TwoColumnPanel.Content>
            <ValidationSummary errors={form.formState.errors} className="sm:col-span-full" />
            <ApiErrorMessage
              error={apiError}
              visible={form.formState.isValid}
              className="sm:col-span-full"
            />

            <div className="sm:col-span-full">
              <Input label="Name" {...form.register("name")} required autoComplete="name" />
            </div>

            <div className="sm:col-span-full">
              {/* Verification code sent to new e-mail must be entered first to prevent user from losing access to the account in case of a typo. Consider also a backup e-mail.  */}
              <InputEmail label="Email" {...form.register("email")} disabled />
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

export default UpdateUserProfile;
