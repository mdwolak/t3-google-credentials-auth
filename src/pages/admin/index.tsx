import type { ReactNode } from "react";
import { useState } from "react";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import AuthPanel from "~/components/auth/AuthPanel";
import { Button } from "~/components/core";
import { type OpenDialogProps, SlideOver, SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";

// const HelloAdmin = () => {
//   return <h1>Hello, admin!</h1>;
// };
// HelloAdmin.getLayout = getLayout;
// export default HelloAdmin;

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AuthPanel showLogo heading="Sign in">
        <div className="space-y-6">
          <Button variant="primary" Icon={XMarkIcon}>
            Icon
          </Button>

          <Button variant="primary" Icon={PlusIcon} rounded />

          <Button onClick={() => setOpen(true)}>Click</Button>

          <Button variant="primary">Sign in</Button>
          <Button variant="primary" disabled>
            Sign in
          </Button>
          <Button variant="primary" isLoading={true}>
            Sign in
          </Button>

          <Button variant="secondary">Sign in</Button>
          <Button variant="secondary" disabled>
            Sign in
          </Button>
          <Button variant="secondary" isLoading={true}>
            Sign in
          </Button>

          <Button variant="destructive">Sign in</Button>
          <Button variant="destructive" disabled>
            Sign in
          </Button>
          <Button variant="destructive" isLoading={true}>
            Sign in
          </Button>
        </div>
      </AuthPanel>
      <SlideOver open={open} setOpen={setOpen}>
        <form className={styles["top-container"]}>
          <div className="flex-1">
            <SlideOverHeader
              title="New Project"
              subtitle="Get started by filling in the information below to create your new project."
              setOpen={setOpen}
            />
            <div className={styles["container--divider"]}>
              {/* Project name */}
              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                  <label
                    htmlFor="project-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                    Project name
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="project-name"
                    id="project-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Project description */}
              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                  <label
                    htmlFor="project-description"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                    Description
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    id="project-description"
                    name="project-description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={() => setOpen(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="ml-3 flex-1">
              Create
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
