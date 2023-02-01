export function head<T>(arr: T[]): T {
  return arr[0];
}

export function isGreaterThan<T>(list: T[], num: number): boolean {
  return Boolean(list.length > num);
}
