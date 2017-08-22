
import { replaceAll } from './replace-all';

it('should return null if str is not defined', () => {
  let str;
  expect(replaceAll(str, {})).toBeNull();
});

it('should return null if str is null', () => {
  expect(replaceAll(null, {})).toBeNull();
});

it('should replace all instances of an object key with a new value', () => {
  const str = 'Apples and bananas with bananas and apples';
  const replacements = {
    "bananas": "oranges",
    "and": "not",
    "apples": "bananas"
  };

  const expected = 'Apples not oranges with oranges not bananas';

  expect(replaceAll(str, replacements)).toEqual(expected);
  expect(str).not.toEqual(expected);
});
