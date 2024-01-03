"use client";

import { TabList } from "~/components/navbars/TabList";
import { useTabIndexFromUrl } from "~/lib/useTabIndexFromUrl";

const tabs = [
  { name: "Profile", href: "profile" },
  { name: "Members", href: "members" },
];

export default function AdminOrganisationLayout({ children }: React.PropsWithChildren) {
  const selectedIndex = useTabIndexFromUrl(tabs);

  return (
    <>
      <TabList tabs={tabs} selectedIndex={selectedIndex} />
      <div>{children}</div>
    </>
  );
}
