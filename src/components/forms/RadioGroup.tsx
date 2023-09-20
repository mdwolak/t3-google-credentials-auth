import type { ReactNode } from "react";

import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";

import { classNames } from "~/lib/common";

type RadioGroupProps = HeadlessRadioGroup.RadioGroupItemProps & {
  children: ReactNode;
  classNames?: { container?: string };
};

const RadioGroup = ({
  children,
  className,
  classNames: innerClassNames,
  ...props
}: RadioGroupProps) => {
  const radioGroupId = useId();
  const id = props.id ?? radioGroupId;

  return (
    <div
      className={classNames(
        "border-subtle [&:has(input:checked)]:border-emphasis relative flex items-start rounded-md border",
        className
      )}>
      <HeadlessRadioGroup.Item
        id={id}
        {...props}
        className={classNames(
          "hover:bg-subtle border-default focus:ring-emphasis absolute left-3 top-[0.9rem] mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border focus:ring-2",
          props.disabled && "opacity-60"
        )}>
        <HeadlessRadioGroup.Indicator
          className={classNames(
            "after:bg-default dark:after:bg-inverted relative flex h-full w-full items-center justify-center rounded-full bg-black after:h-[6px] after:w-[6px] after:rounded-full after:content-['']",
            props.disabled ? "after:bg-muted" : "bg-black"
          )}
        />
      </HeadlessRadioGroup.Item>
      <label
        htmlFor={id}
        className={classNames("text-default p-4 pl-10 pt-3", innerClassNames?.container)}>
        {children}
      </label>
    </div>
  );
};

const RadioGroupGroup = ({
  children,
  className,
  onValueChange,
  ...passThroughProps
}: HeadlessRadioGroup.RadioGroupProps) => {
  return (
    <HeadlessRadioGroup.Root
      className={className}
      onValueChange={onValueChange}
      {...passThroughProps}>
      {children}
    </HeadlessRadioGroup.Root>
  );
};

const Item = RadioGroup;
const Group = RadioGroupGroup;

export { RadioGroup, RadioGroupGroup, Item, Group };
