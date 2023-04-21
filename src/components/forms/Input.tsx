import React, {
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
  forwardRef,
  useId,
} from "react";

import classNames from "classnames";
import { useFormContext } from "react-hook-form";

import { FieldError, Label, getFieldError } from "./Form";

interface InputProps extends ComponentPropsWithRef<"input"> {
  label?: ReactNode;
  // name: Path<TFormValues>;
  // register?: UseFormRegister<TFormValues>;
}

export const Input = forwardRef(function Input(
  { className, id, label, type = "text", ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = getFieldError(errors, props.name as string)?.message;

  const uniqueInputId = useId();
  const targetId = id || uniqueInputId;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        className={classNames(
          "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 sm:text-sm",
          className,
          { "border-red-500": error }
        )}
        id={targetId}
        ref={ref}
        type={type}
        {...props}
      />
      <FieldError error={error} />
    </div>
  );
});

export const InputEmail = forwardRef(function InputEmail(
  props: InputProps,
  ref: Ref<HTMLInputElement>
) {
  //use autocomplete="username" if email is used as username
  return (
    <Input
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect="off"
      inputMode="email"
      ref={ref}
      type="email"
      {...props}
    />
  );
});

export const InputPassword = forwardRef(function InputPassword(
  props: InputProps,
  ref: Ref<HTMLInputElement>
) {
  //Use autocomplete="new-password" and id="new-password" for a new password
  //Use autocomplete="current-password" and id="current-password" for an existing password
  const { className, placeholder, ...rest } = props;
  return (
    <Input className={className} placeholder={placeholder} ref={ref} type="password" {...rest} />
  );
});
