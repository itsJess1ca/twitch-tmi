import { isNumber, isString } from 'util';

export function mergeArrays<T>(...arrs: T[][]): T[] {
  const hash = new Set();
  let response: T[] = [];

  for (const arr of arrs) {
    for (const element of arr) {
      if (isString(element) || isNumber(element)) {
        if (!hash.has(element)) {
          hash.add(element);
          response.push(element);
        }
      } else {
        const str = JSON.stringify(element);
        if (!hash.has(str)) {
          hash.add(str);
          response.push(element);
        }
      }
    }
  }

  return response;
}
