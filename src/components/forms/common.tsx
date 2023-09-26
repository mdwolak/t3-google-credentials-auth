import React, { type ComponentProps, type FC } from "react";

import classNames from "classnames";
import get from "lodash.get";
import type { FieldErrors } from "react-hook-form";

export function Label(props: ComponentProps<"label">) {
  return (
    <label
      className={classNames("block text-sm font-medium text-gray-700", props.className)}
      {...props}>
      {props.children}
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

export const getFieldError = (errors: FieldErrors, fieldName: string) => {
  return get(errors, fieldName);
};

/* Field wrapper for input elements */
export type FieldWrapperProps = {
  label: React.ReactNode;
  control: React.ReactNode;
  error: React.ReactNode;
};

export const DefaultWrap: FC<FieldWrapperProps> = ({ label, control, error }) => {
  return (
    <>
      <div>
        {label}
        <div className="mt-2">
          {control}
          {error}
        </div>
      </div>
    </>
  );
};

const NoWrap: FC<FieldWrapperProps> = ({ label, control, error }) => {
  return (
    <>
      {label}
      {control}
      {error}
    </>
  );
};
