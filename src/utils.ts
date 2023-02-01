export function head<T>(arr: T[]): T {
  return arr[0];
}

export function isGreaterThan<T>(list: T[], num: number): boolean {
  return Boolean(list.length > num);
}

export function isEmpty<T>(list: T[]): boolean {
  return !isGreaterThan(list, 0);
}
