// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
