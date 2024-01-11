import React, { type ComponentProps, type FC } from "react";

import classNames from "classnames";
import get from "lodash.get";
import type { FieldErrors } from "react-hook-form";

export const Asterisk = () => <span className="ml-1 text-sm font-medium text-red-500">*</span>;

export function Label(props: ComponentProps<"label"> & { asterisk?: boolean }) {
  const { asterisk, children, ...rest } = props;
  return (
    <label
      className={classNames("block text-sm font-medium text-gray-700", props.className)}
      {...rest}>
      {children}
      {asterisk && <Asterisk />}
    </label>
  );
}

export function Description(props: ComponentProps<"div"> & { description: string }) {
  return (
    <div className={"inline text-gray-500"}>
      <span>{props.description}</span>
    </div>
  );
}

export function FieldError({ error }: { error: string }) {
  return (
    <span role="alert" aria-label={error} className="text-sm text-red-500">
      {error}
    </span>
  );
}

type FieldsetProps = {
  disabled?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Fieldset({ disabled, title, description, children }: FieldsetProps) {
  return (
    <fieldset
      disabled={disabled}
      className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>}
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
        {/* Wrap form fields with <div sm:col-span-(2,3,4,5,full)> */}
        {children}
      </div>
    </fieldset>
  );
}

/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>; */
Fieldset.Buttons = function FieldsetButtons({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex items-center justify-end gap-x-6">{children}</div>;
};

export const getFieldError = (errors: FieldErrors, fieldName: string) => {
  return get(errors, fieldName);
};

/* Field wrapper for input elements */
export type FieldWrapperProps = {
  id: string;
  label: string | React.ReactNode;
  control: React.ReactNode;
  error: string | React.ReactNode;
  asterisk?: boolean;
};

export const DefaultWrap: FC<FieldWrapperProps> = ({ id, label, control, error, asterisk }) => {
  return (
    <>
      <div>
        {typeof label === "string" ? (
          <Label htmlFor={id} asterisk={asterisk}>
            {label}
          </Label>
        ) : (
          label
        )}
        <div className="mt-2">
          {control}
          {typeof error === "string" ? <FieldError error={error} /> : error}
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NoWrap: FC<FieldWrapperProps> = ({ id, label, control, error, asterisk }) => {
  return (
    <>
      {typeof label === "string" ? (
        <Label htmlFor={id} asterisk={asterisk}>
          {label}
        </Label>
      ) : (
        label
      )}
      {control}
      {typeof error === "string" ? <FieldError error={error} /> : error}
    </>
  );
};
