import { type SessionUser } from "next-auth";

import { FolderIcon } from "@heroicons/react/24/outline";

import { SignInButton } from "~/components/navbars/SignInButton";
import { classNames } from "~/lib/common";
import { isAdmin } from "~/server/services/permission.service";

interface NavbarProps {
  user?: SessionUser;
}

export function Navbar({ user }: NavbarProps) {
  const orgId = user?.orgId;

  const menuItems: MenuItem[] = [
    { name: "Schedules", href: "schedules", icon: FolderIcon, current: false },
    ...(orgId
      ? [
          {
            name: "Addresses",
            href: `/org/${orgId}/addresses`,
            icon: FolderIcon,
            current: false,
          },
          {
            name: "Activities",
            href: `/org/${orgId}/activities`,
            icon: FolderIcon,
            current: false,
          },
          {
            name: "Exemplars",
            href: `/org/${orgId}/exemplars`,
            icon: FolderIcon,
            current: false,
          },
        ]
      : []),
  ];

  const adminItems: MenuItem[] = [
    ...(isAdmin(user)
      ? [{ name: "Organisations", href: "/admin/org", icon: FolderIcon, current: true }]
      : []),
  ];

  return (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />{" "}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <Menu menuItems={menuItems} />
          </li>
          {adminItems.length > 0 && (
            <li>
              <div className="mb-2 text-xs font-semibold leading-6 text-gray-400">Admin</div>
              <Menu menuItems={adminItems} />
            </li>
          )}
          {/* Adapt          */}
          <SignInButton user={user} />
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}

interface MenuProps {
  menuItems: MenuItem[];
}

function Menu({ menuItems }: MenuProps) {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {menuItems.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className={classNames(
              item.current
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
            )}>
            <item.icon
              className={classNames(
                item.current ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                "h-6 w-6 shrink-0",
              )}
              aria-hidden="true"
            />
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
