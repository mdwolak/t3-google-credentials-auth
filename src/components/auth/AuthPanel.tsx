import classNames from "classnames";
import React from "react";
import SEOHead from "../SEOHead";


interface Props {
  title: string;
  description: string;
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export default function AuthPanel(props: React.PropsWithChildren<Props>) {
  return (

    // {props.loading && (
    //   <div className="absolute z-50 flex h-screen w-full items-center bg-gray-50">
    //     {/* <Loader /> */}
    //   </div>
    // )}
    // <div className="mb-auto mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    //   <div className="border-1 mx-2 rounded-md border-gray-200 bg-white px-4 py-10 sm:px-10">
    //     {props.children}
    //   </div>
    // </div>

    <section className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead title={props.title} description={props.description} />
      <div className="w-full max-w-md space-y-8">
        <div>
          {/* {props.showLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="mx-auto h-24 w-auto"
              src="/logo.svg"
              alt="Your Company"
            />
          )} */}

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {props.heading}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              start your 14-day free trial
            </a>
          </p>
        </div>
        <div className="bg-white shadow sm:rounded-lg p-8">
          {props.children}
        </div>
      </div>

    </section>

  );
}
