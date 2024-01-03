"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Tab } from "@headlessui/react";
import classNames from "classnames";

export type Tab = {
  name: string;
  href: string;
  count?: string;
  current?: boolean;
};

export function TabList({
  tabs,
  selectedIndex: index = 0,
}: {
  tabs: Tab[];
  selectedIndex?: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState(index);
  const router = useRouter();

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    const tab = tabs[index] as Tab;
    router.push(tab.href);
  };
  return (
    <div className="border-b border-gray-200">
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab.List className="-mb-px flex space-x-8" aria-label="Tabs" as="nav">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={classNames(
                index == selectedIndex
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                "flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
              )}
              aria-current={tab.current ? "page" : undefined}>
              {tab.name}
              {tab.count ? (
                <span
                  className={classNames(
                    tab.current ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-900",
                    "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block",
                  )}>
                  {tab.count}
                </span>
              ) : null}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
