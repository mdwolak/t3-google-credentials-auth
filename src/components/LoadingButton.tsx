import React from "react";

import classNames from "classnames";

import Spinner from "./Spinner";

type LoadingButtonProps = {
  children: React.ReactNode;
  loading: boolean;
  //color: "primary" | "secondary" | "tertiary";
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  //className="w-full justify-center"
  //color = "primary"
  loading = false,
}) => {
  const textColor = "text-white";
  const btnColor = "bg-ct-yellow-600";

  return (
    <div>
      <button
        type="submit"
        className={classNames(
          "relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          btnColor,
          loading && "bg-[#ccc]"
        )}>
        {loading ? (
          <div className="flex items-center gap-3">
            <Spinner />
            <span className="inline-block text-slate-500">Loading...</span>
          </div>
        ) : (
          <span className={`${textColor}`}>{children}</span>
        )}
      </button>
    </div>
  );
};
