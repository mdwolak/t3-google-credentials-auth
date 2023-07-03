import { Fragment, type ReactNode } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type OpenDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type SlideOverProps = OpenDialogProps & {
  children: ReactNode;
};

export function SlideOver({ open, setOpen, children }: SlideOverProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export type SlideOverHeaderProps = Pick<OpenDialogProps, "setOpen"> & {
  title: string;
  subtitle: string;
};

export function SlideOverHeader({ title, subtitle, setOpen }: SlideOverHeaderProps) {
  return (
    <div className="bg-gray-50 px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between space-x-3">
        <div className="space-y-1">
          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </Dialog.Title>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex h-7 items-center">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setOpen(false)}>
            <span className="sr-only">Close panel</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
