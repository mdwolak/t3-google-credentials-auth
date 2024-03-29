import type { ReactNode } from "react";

import { classNames } from "~/lib/common";

const styles = {
  info: "border-blue-300 bg-blue-50 text-blue-800",
  success: "border-green-300 bg-green-50 text-green-800",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
  error: "border-red-300 bg-red-50 text-red-800",
};

export interface AlertProps {
  children: ReactNode;
  severity: "info" | "success" | "warning" | "error";
  className?: string;
}
export const Alert = ({ severity, className, children }: AlertProps) => {
  return (
    <div
      className={classNames("mb-4 flex rounded-lg border p-4 text-sm", styles[severity], className)}
      role="alert">
      <svg
        aria-hidden="true"
        className="mr-3 inline h-5 w-5 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"></path>
      </svg>
      <span className="sr-only">{severity}</span>
      <div>{children}</div>
    </div>
  );
};
