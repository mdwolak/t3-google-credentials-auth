"use client";

import Link from "next/link";
import { Fragment } from "react";

import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

import { classNames } from "~/lib/common";

type MenuItem = {
  href?: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
} & ({ href: string } | { onClick: () => void });

function MenuList({ items, srName }: { items: MenuItem[]; srName: string }) {
  return (
    <Menu as="div" className="relative flex-none">
      <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
        <span className="sr-only">Open options</span>
        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {items.map((item, index) => (
            /* Use the `active` state to conditionally style the active item. */
            <Menu.Item key={index} as={Fragment} disabled={item.disabled}>
              {({ active, disabled }) =>
                disabled ? (
                  <span className="block px-3 py-1 text-sm leading-6 text-gray-900 opacity-75">
                    {item.label}
                    <span className="sr-only">, {srName}</span>
                  </span>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    {...(item.onClick
                      ? {
                          onClick: (e) => {
                            e.preventDefault();
                            item.onClick?.();
                          },
                        }
                      : {})}
                    className={classNames(
                      active && "bg-gray-50",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}>
                    {item.label}
                    <span className="sr-only">, {srName}</span>
                  </Link>
                )
              }
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
export { MenuList as Menu };
