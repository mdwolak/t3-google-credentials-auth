import { Tab } from "~/components/navbars/Tabs";
import type { SVGComponent } from "~/types/common";

export type TabItem = {
  label: string | React.ReactNode;
  href?: string;
  count?: number;
  current?: boolean;
  Icon?: SVGComponent | React.ElementType; //accept lucid-react icons | heroicons
  content?: React.ReactNode;
};

export type TabListProps = {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
};

export function TabList({ tabs, defaultIndex = 0, onChange }: TabListProps) {
  return (
    <Tab.Group defaultIndex={defaultIndex} {...(onChange ? { onChange } : {})}>
      <Tab.List>
        {tabs.map((tab, index) => (
          <Tab key={index} count={tab.count} Icon={tab.Icon}>
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      {tabs.some((tab) => tab.content) && (
        <Tab.Panels>
          {tabs.map((tab, index) => (
            <Tab.Panel key={index}>{tab.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      )}
    </Tab.Group>
  );
}
