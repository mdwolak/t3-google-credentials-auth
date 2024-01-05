"use client";

import * as React from "react";
import { Fragment } from "react";

import { Tab as HeadlessTab } from "@headlessui/react";

import { classNames } from "~/lib/common";
import type { SVGComponent } from "~/types/common";

const TabList = React.forwardRef<
  React.ElementRef<typeof HeadlessTab.List>,
  React.ComponentPropsWithoutRef<typeof HeadlessTab.List>
>(({ className, ...props }, ref) => (
  <div className="border-b border-gray-200">
    <HeadlessTab.List
      as="nav"
      ref={ref}
      aria-label="Tabs"
      className={classNames("-mb-px flex space-x-8", className)}
      {...props}
    />
  </div>
));
TabList.displayName = HeadlessTab.List.displayName;

interface TabItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: SVGComponent | React.ElementType; //accept lucid-react icons | heroicons
  count?: number;
}

const TabItem = React.forwardRef<HTMLButtonElement, TabItemProps>(
  ({ className, children, count, Icon, ...props }, ref) => (
    <HeadlessTab as={Fragment}>
      {({ selected }) => (
        <button
          ref={ref}
          className={classNames(
            selected
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
            "flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
            className,
          )}
          {...props}
          aria-current={selected ? "page" : undefined}>
          {Icon && (
            <Icon
              className={classNames(
                selected ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500",
                "-ml-0.5 mr-2 h-5 w-5",
              )}
              aria-hidden="true"
            />
          )}
          {children}
          {count ? (
            <span
              className={classNames(
                selected ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-900",
                "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block",
              )}>
              {count}
            </span>
          ) : null}
        </button>
      )}
    </HeadlessTab>
  ),
);
// export const TabItem = React.forwardRef<
//   React.ElementRef<typeof HeadlessTab>,
//   React.ComponentPropsWithoutRef<typeof HeadlessTab>
// >(({ className, ...props }, ref) => (
//   <HeadlessTab
//     ref={ref}
//     className={classNames(
//       "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
//       className,
//     )}
//     {...props}
//   />
// ));
TabItem.displayName = HeadlessTab.displayName;

const TabPanel = React.forwardRef<
  React.ElementRef<typeof HeadlessTab.Panel>,
  React.ComponentPropsWithoutRef<typeof HeadlessTab.Panel>
>(({ className, ...props }, ref) => (
  <HeadlessTab.Panel
    ref={ref}
    className={classNames(
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabPanel.displayName = HeadlessTab.Panel.displayName;

const Tab = Object.assign(TabItem, {
  Group: HeadlessTab.Group,
  List: TabList,
  Panels: HeadlessTab.Panels,
  Panel: TabPanel,
  // Pill,
});

export { Tab };
