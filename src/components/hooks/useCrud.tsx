/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { toast } from "~/components/core";
import { setFormErrors } from "~/components/forms";
import type { HandleCloseProps } from "~/lib/common";
import { api } from "~/utils/api";

interface CrudProps<F extends FieldValues = FieldValues> {
  path: "exemplar";
  name: string;
  form: UseFormReturn<F>;
}
export function useCrud<T = any, F extends FieldValues = FieldValues>({
  path,
  form,
  name,
}: CrudProps<F>) {
  const apiContext = api.useContext();

  const getCreateMutation = ({ handleClose }: Partial<HandleCloseProps<T>> = {}) => {
    return api[path].create.useMutation({
      onSuccess(data: any) {
        handleClose?.(data);
        apiContext[path].invalidate();
        toast.success(`${name} created successfully`);
      },
      onError(error) {
        const zodError = error.data?.zodError;
        if (zodError) setFormErrors(form, zodError);
        else toast.error(error.message);
      },
    });
  };

  const getUpdateMutation = ({ handleClose }: Partial<HandleCloseProps<T>> = {}) => {
    return api[path].update.useMutation({
      onSuccess(data: any) {
        handleClose?.(data);
        apiContext[path].invalidate();
        toast.success(`${name} updated successfully`);
      },
      onError(error: any) {
        const zodError = error.data?.zodError;
        if (zodError) setFormErrors(form, zodError);
        else toast.error(error.message);
      },
    });
  };

  const getDeleteMutation = ({ handleClose }: Partial<HandleCloseProps<T>> = {}) => {
    return api[path].delete.useMutation({
      onSuccess(data: any) {
        handleClose?.(data);
        apiContext[path].invalidate();
        toast.success(`${name} deleted successfully`);
      },
      onError(error) {
        toast.error(error.message);
      },
    });
  };

  return {
    getCreateMutation,
    getUpdateMutation,
    getDeleteMutation,
  };
}
