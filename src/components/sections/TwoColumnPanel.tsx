import React from "react";

type TwoColumnPanelProps = {
  disabled?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
};

export const TwoColumnPanel = ({
  disabled,
  title,
  description,
  children,
  as,
}: TwoColumnPanelProps) => {
  const Component = as || "div";

  return (
    <Component
      disabled={disabled}
      className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>}
      </div>
      {children}
    </Component>
  );
};

type TwoColumnPanelContentProps = {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
};
const TwoColumnPanelContent = ({ children, as }: TwoColumnPanelContentProps) => {
  const Component = as || "div";

  return (
    <Component className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
      {/* Wrap form fields with <div sm:col-span-(2,3,4,5,full)> */}
      {children}
    </Component>
  );
};
TwoColumnPanel.Content = TwoColumnPanelContent;
