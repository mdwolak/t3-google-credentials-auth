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
