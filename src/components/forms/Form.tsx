/*
 " @source: https://omkarkulkarni.vercel.app/blog/reusable-form-component-in-react-using-react-hook-form-and-zod
 */
import { type ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import type {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
  UseFormProps as UseHookFormProps,
} from "react-hook-form";
import { FormProvider, useForm as useHookForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { TypeOf, ZodSchema } from "zod";

export { type FieldErrors } from "react-hook-form";

interface UseFormProps<T extends ZodSchema<any>> extends UseHookFormProps<TypeOf<T>> {
  schema: T;
}

export const useForm = <T extends ZodSchema<any>>({ schema, ...formConfig }: UseFormProps<T>) => {
  return useHookForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
};

interface FormProps<T extends FieldValues = any> extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  handleSubmit: SubmitHandler<T>;
  handleError?: SubmitErrorHandler<T>;
}

/*
Sample usage:
const handleError = (errors: FieldErrors<UserCreateInput>) => {
  console.log(errors);
};
...
<Form form={form} handleSubmit={handleSubmit} handleError={handleError}>
*/

export const Form = <T extends FieldValues>(props: FormProps<T>) => {
  const { form, handleSubmit, handleError, children, ...rest } = props;
  return (
    <FormProvider {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form
            .handleSubmit(
              handleSubmit,
              handleError
            )(event)
            .catch((err) => {
              toast.error("An error occurred: " + err.message);
            });
        }}
        {...rest}>
        {children}
      </form>
    </FormProvider>
  );
};

export function Label(props: ComponentProps<"label">) {
  return (
    <label
      className={classNames("block text-sm font-medium text-gray-700", props.className)}
      {...props}>
      {props.children}
    </label>
  );
}

export function FieldError({ error }: { error: string }) {
  return (
    <span role="alert" aria-label={error} className="text-sm text-red-500">
      {error}
    </span>
  );
}
