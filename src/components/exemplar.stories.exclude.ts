import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  // ...
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  // ...
};
