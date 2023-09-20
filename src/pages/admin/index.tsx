import { useState } from "react";

import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";

import { getLayout } from "~/components/layouts/Layout";

const settings = [
  {
    name: "Public access",
    description: "This project would be available to anyone who has the link",
  },
  {
    name: "Private to Project Members",
    description: "Only members of this project would be able to access",
  },
  { name: "Private to you", description: "You are the only one able to access this project" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Example = () => {
  const [selected, setSelected] = useState(settings[0]);

  return (
    <HeadlessRadioGroup value={selected} onChange={setSelected}>
      <HeadlessRadioGroup.Label className="sr-only">Privacy setting</HeadlessRadioGroup.Label>
      <div className="-space-y-px rounded-md bg-white">
        {settings.map((setting, settingIdx) => (
          <HeadlessRadioGroup.Option
            key={setting.name}
            value={setting}
            className={({ checked }) =>
              classNames(
                settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                settingIdx === settings.length - 1 ? "rounded-bl-md rounded-br-md" : "",
                checked ? "z-10 border-indigo-200 bg-indigo-50" : "border-gray-200",
                "relative flex cursor-pointer border p-4 focus:outline-none"
              )
            }>
            {({ active, checked }) => (
              <>
                <span
                  className={classNames(
                    checked ? "border-transparent bg-indigo-600" : "border-gray-300 bg-white",
                    active ? "ring-2 ring-indigo-600 ring-offset-2" : "",
                    "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border"
                  )}
                  aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="ml-3 flex flex-col">
                  <HeadlessRadioGroup.Label
                    as="span"
                    className={classNames(
                      checked ? "text-indigo-900" : "text-gray-900",
                      "block text-sm font-medium"
                    )}>
                    {setting.name}
                  </HeadlessRadioGroup.Label>
                  <HeadlessRadioGroup.Description
                    as="span"
                    className={classNames(
                      checked ? "text-indigo-700" : "text-gray-500",
                      "block text-sm"
                    )}>
                    {setting.description}
                  </HeadlessRadioGroup.Description>
                </span>
              </>
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
};
Example.getLayout = getLayout;
export default Example;
