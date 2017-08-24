
import { extractNumber } from './extract-number';

it('should return 0 if no int provided', () => {
  expect(extractNumber('test')).toEqual(0);
});

it('should extract a number from a string', () => {
  expect(extractNumber('Testing 123')).toEqual(123);
});
