import { UserIcon } from "@heroicons/react/20/solid";
import type { Meta, StoryFn } from "@storybook/react";

import type { SVGComponent } from "~/types/common";

import { Tab } from "./Tabs";

const meta: Meta<typeof Tab> = {
  title: "Navbars/Tabs",
  component: Tab,
  // ...
};

export default meta;

type TabProps = {
  defaultIndex: number;
  Icon: SVGComponent | React.ElementType;
  count: number;
  tab1Label: string;
};

const Template: StoryFn<TabProps> = ({ defaultIndex, Icon, count, tab1Label }) => {
  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List>
        <Tab count={count} Icon={Icon}>
          {tab1Label}
        </Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export const Primary = Template.bind({});

Primary.args = {
  defaultIndex: 1,
  Icon: UserIcon,
  count: 2,
  tab1Label: "Tab 1",
};
