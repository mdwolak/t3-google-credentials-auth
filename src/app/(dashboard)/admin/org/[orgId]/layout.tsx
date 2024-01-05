"use client";

import { useRouter } from "next/navigation";

import { UserIcon, UsersIcon } from "@heroicons/react/20/solid";

import { type TabItem, TabList } from "~/components/navbars/TabList";
import { Tab } from "~/components/navbars/Tabs";
import { useTabIndexFromUrl } from "~/lib/useTabIndexFromUrl";

const tabs: TabItem[] = [
  { label: "Profile", href: "profile", count: 1 },
  { label: "Members", href: "members", Icon: UsersIcon },
];

export default function AdminOrganisationLayout({ children }: React.PropsWithChildren) {
  const selectedIndex = useTabIndexFromUrl(tabs);

  const router = useRouter();

  const handleTabChange = (index: number) => {
    const tab = tabs[index];
    router.push(tab?.href as string);
  };

  return (
    <>
      <TabList tabs={tabs} defaultIndex={selectedIndex} onChange={handleTabChange} />
      <div>{children}</div>

      <Tab.Group defaultIndex={1}>
        <Tab.List>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab count={2} Icon={UserIcon}>
            Tab 3
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>Content 1</Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
          <Tab.Panel>Content 3</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
