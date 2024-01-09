import React from "react";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: {
    label: string;
    url: string;
  }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <div className="flex flex-col">
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      <nav aria-label="Breadcrumbs" className="order-first flex space-x-2 text-sm font-semibold">
        {breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <a className="text-slate-500 hover:text-slate-600" href={breadcrumb.url}>
              {breadcrumb.label}
            </a>
            {index < breadcrumbs.length - 1 && (
              <div aria-hidden="true" className="select-none text-slate-400">
                /
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default PageHeader;
