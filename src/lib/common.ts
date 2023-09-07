// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function camelCaseToSpacedOut(camelCase: string): string {
  const spacedOut = camelCase.replace(/([A-Z])|_/g, " $1");
  return spacedOut
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandleCloseProps<T = any> = {
  handleClose: (data?: T) => void;
};

export type NonNullableProps<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export function stripNullishProps<T>(obj: T): NonNullableProps<T> {
  return Object.fromEntries(
    Object.entries(obj ?? {}).filter(([, value]) => value != null)
  ) as NonNullableProps<T>;
}

export const truncate = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

/**
 * Create a date YYYY-MM-DD date string that is typecasted as a `Date`.
 * Hack when using `defaultValues` in `react-hook-form`
 * This is because `react-hook-form` doesn't support `defaultValue` of type `Date` even if the types say so
 * @see https://github.com/orgs/react-hook-form/discussions/4718#discussioncomment-2738053
 */
export function dateToInputDate(date?: Date) {
  if (!date || !isValidDate(date)) {
    return undefined;
  }
  return date.toISOString().slice(0, 10) as unknown as Date;
}
