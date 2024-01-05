import { usePathname } from "next/navigation";

import { type TabItem } from "~/components/navbars/TabList";

export function useTabIndexFromUrl(tabs: TabItem[]) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop() || "";
  const selectedIndex = tabs.findIndex((tab) => tab.href === lastSegment);
  if (selectedIndex === -1) throw new Error(`No tab found for url segment "${lastSegment}"`);
  return selectedIndex;
}
