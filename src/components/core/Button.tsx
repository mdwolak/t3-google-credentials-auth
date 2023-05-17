import type { ComponentPropsWithRef } from "react";
import { type Ref, forwardRef } from "react";

import classNames from "classnames";

import { Spinner } from "~/components/core/Spinner";

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const variants = {
  primary: "bg-indigo-600 text-white border-transparent", //
  secondary: "bg-white text-black border-gray-300 shadow",
  destructive: "bg-red-600 text-white border-transparent",
};

type ButtonProps = ComponentPropsWithRef<"button"> & {
  isLoading?: boolean;
  variant?: keyof typeof variants;
  icon?: React.ReactNode;
  size?: keyof typeof sizes;
};

export const Button = forwardRef(function Button(
  {
    children,
    className,
    type = "button",
    isLoading,
    disabled,
    variant = "primary",
    icon,
    size = "sm",
    ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  disabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        "relative flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none",
        variants[variant],
        className,
        disabled ? "cursor-not-allowed opacity-60" : "hover:opacity-80"
      )}
      {...props}>
      {isLoading ? (
        <>
          <Spinner className={`mr-2 ${sizes[size]}`} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className={`mr-2 ${sizes[size]}`}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});
