import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import classNames from "classnames";

export type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & NextLinkProps;

export const Link = (props: LinkProps) => {
  const { href, as, replace, scroll, shallow, prefetch, locale, className, children, ...rest } =
    props;

  return (
    <NextLink
      passHref={true}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      className={classNames("font-medium text-indigo-600 hover:text-indigo-500", className)}
      {...rest}>
      {children}
    </NextLink>
  );
};
