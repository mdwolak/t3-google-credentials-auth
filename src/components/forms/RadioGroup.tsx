import { type ReactNode, useState } from "react";

import { RadioGroup as HRG } from "@headlessui/react";
import { type FieldError } from "react-hook-form";

import { classNames } from "~/lib/common";

export type Option<T> = {
  name: string;
  description: ReactNode;
  value: T;
  disabled?: boolean;
};

type RadioGroupProps<T> = {
  options: Option<T>[];
  // if option value is not provided, then option is used as value
  onChange: (value: T) => void;
  onBlur?: any;
  value?: T;
  srOnly?: string;
  error?: FieldError | undefined;
};

/* Radio group with options
 * @see https://tailwindui.com/components/application-ui/forms/radio-groups
 * @see https://headlessui.com/react/radio-group
 * @see https://github.com/singhBinary/rhf-with-headlessui/blob/main/components/formElements/RadioGroup.tsx
 */
const RadioGroup = <T extends string | number | Record<string, any>>({
  options,
  onChange,
  onBlur,
  value,
  srOnly,
  error,
}: RadioGroupProps<T>) => {
  return (
    <>
      <HRG value={value} onChange={onChange} onBlur={onBlur}>
        <HRG.Label className="sr-only">{srOnly}</HRG.Label>

        {/* @see https://tailwindui.com/components/application-ui/forms/radio-groups#component-7b583a008c3fc62c0fe403d10ca042bb */}
        <div className="-space-y-px rounded-md bg-white">
          {options.map((option, optionIdx) => (
            <HRG.Option
              key={String(optionIdx)} //{setting.key ?? setting.name}
              value={option.value}
              disabled={option.disabled}
              className={({ checked }) =>
                classNames(
                  optionIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                  optionIdx === options.length - 1 ? "rounded-bl-md rounded-br-md" : "",
                  checked ? "z-10 border-indigo-200 bg-indigo-50" : "border-gray-200",
                  option.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                  "relative flex border p-4 focus:outline-none"
                )
              }>
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      checked ? "border-transparent bg-indigo-600" : "border-gray-300 bg-white",
                      active && "ring-2 ring-indigo-600 ring-offset-2",
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                    )}
                    aria-hidden="true">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <span className="ml-3 flex flex-col">
                    <HRG.Label
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}>
                      {option.name}
                    </HRG.Label>
                    <HRG.Description
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "block text-sm"
                      )}>
                      {option.description}
                    </HRG.Description>
                  </span>
                </>
              )}
            </HRG.Option>
          ))}
        </div>
      </HRG>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error.message}
        </p>
      )}
    </>
  );
};

export { RadioGroup };
