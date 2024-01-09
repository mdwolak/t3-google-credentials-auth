import { type TabItem } from "~/components/navbars/TabList";

export function getTabIndexFromPath(tabs: TabItem[], pathname: string) {
  const lastSegment = pathname.split("/").pop() || "";
  const selectedIndex = tabs.findIndex((tab) => tab.href === lastSegment);
  if (selectedIndex === -1) throw new Error(`No tab found for url segment "${lastSegment}"`);
  return selectedIndex;
}

export function getTabIndexFromSearchParam(tabs: TabItem[], selectedTab: string | null) {
  if (!selectedTab) return 0;

  const defaultIndex = tabs.findIndex((tab) => tab.name === selectedTab);
  if (defaultIndex === -1) throw new Error(`No tab found for tab parameter: "${selectedTab}"`);
  return defaultIndex;
}
