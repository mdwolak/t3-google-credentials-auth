import { UsersIcon } from "@heroicons/react/20/solid";
import type { Meta, StoryObj } from "@storybook/react";

import type { TabItem } from "~/components/navbars/TabList";
import { TabList } from "~/components/navbars/TabList";

const meta: Meta<typeof TabList> = {
  title: "Navbars/TabList",
  component: TabList,
  // ...
};

export default meta;
type Story = StoryObj<typeof meta>;

const tabsAsPages: TabItem[] = [
  { label: "Profile", href: "profile", count: 1 },
  { label: "Members", href: "members", Icon: UsersIcon },
];

const handleTabChange = (index: number) => {
  console.log(`Navigating to ${tabsAsPages[index]?.href}`);
  //const tab = tabs[index] as TabItem;
  //router.push(tab.href);
};

export const TabsAsPages: Story = {
  args: {
    tabs: [
      { label: "Profile", href: "profile", count: 1 },
      { label: "Members", href: "members", Icon: UsersIcon },
    ],
    onChange: handleTabChange,
    defaultIndex: 1,
  },
};

export const TabsAsComponents: Story = {
  args: {
    tabs: [
      { label: "Profile", count: 1, content: <>Profile</> },
      { label: "Members", Icon: UsersIcon, content: <>Members</> },
    ],
    defaultIndex: 1,
  },
};
