import React, { type ComponentProps, forwardRef } from 'react';
import { FieldError } from '~/components/forms/Form';

interface InputProps extends ComponentProps<'input'> {
  label: string;
}

export const InputField = forwardRef<HTMLInputElement, InputProps>(function InputField(
  { label, type = 'text', ...props },
  ref
) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} ref={ref} {...props} />
      <FieldError name={props.name} />
    </div>
  );
});
