import type { Meta, StoryFn } from "@storybook/react";
import { useForm } from "react-hook-form";

import { RadioGroup, type RadioGroupProps } from "./RadioGroup";

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof RadioGroup>;

export default meta;

/*
 * STORIES
 */
const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({
  value: index,
  name: day,
}));

const timeOptions = Array.from({ length: 15 }, (_, i) => ({
  value: i + 6,
  name: `${i + 6}`,
}));

const privacyOptions = [
  {
    value: "public",
    name: "Public access",
    description: "This project would be available to anyone who has the link",
  },
  {
    value: "private",
    name: "Private to Project Members",
    description: "Only members of this project would be able to access",
  },
  {
    value: "private_to_you",
    name: "Private to you",
    description: (
      <span>
        You <b>are</b> the only one able to access this project
      </span>
    ),
    disabled: true,
  },
];

const Template: StoryFn<RadioGroupProps<number | string>> = (args) => {
  const { control } = useForm();

  return (
    <form>
      <RadioGroup control={control} name="name" {...args} defaultValue={""} />
    </form>
  );
};

export const DaysOfWeek = Template.bind({});
DaysOfWeek.args = {
  label: "What day is the activity on? ",
  options: dayOptions,
  style: "SmallCards",
  containerClass: "grid grid-cols-7 gap-2",
};

export const RangeOfHours = Template.bind({});
RangeOfHours.args = {
  label: "Select hour",
  options: timeOptions,
  style: "SmallCards",
  containerClass: "grid grid-cols-7 gap-2",
};

export const Privacy = Template.bind({});
Privacy.args = {
  label: "Select privacy",
  options: privacyOptions,
  style: "SmallCards",
  containerClass: "grid grid-cols-7 gap-2",
};
