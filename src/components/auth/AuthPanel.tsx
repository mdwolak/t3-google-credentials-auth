import React from "react";

interface Props {
  children?: React.ReactNode;
  footerText?: React.ReactNode | string;
  heading?: string;
  isLoading?: boolean;
  showLogo?: boolean;
}

const AuthPanel = (props: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          {props.showLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="mx-auto h-24 w-auto" src="/logo.svg" alt="Your Company" />
          )}

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {props.heading}
          </h2>
        </div>
        <div className="bg-white p-8 shadow sm:rounded-lg">{props.children}</div>
      </div>
    </div>
  );
};
export default AuthPanel;
