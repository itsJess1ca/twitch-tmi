import { toNumber } from './to-number';

export function extractNumber(str: string): number {
  const parts = str.split(' ');
  for (const part of parts) {
    if (!isNaN(toNumber(part))) return ~~part;
  }
  return 0;
}
