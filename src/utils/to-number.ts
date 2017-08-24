export function toNumber(str: string, precision: number = 0): number {
  if (str === null) return 0;
  const factor = Math.pow(10, isFinite(precision) ? precision : 0);
  return Math.round(str as any * factor) / factor;
}
