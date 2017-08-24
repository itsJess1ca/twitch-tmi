import { toNumber } from './to-number';

it('should return a number when passed a string', () => {
  expect(toNumber('123', 0)).toEqual(123);
});
