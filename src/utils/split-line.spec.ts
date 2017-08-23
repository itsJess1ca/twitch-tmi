import { splitLine } from './split-line';

it('should split a string to a predefined length and return both segments in an array', () => {
  const str = 'lorem ipsum dolor sit amet';
  const expected = ['lorem ipsum', 'dolor sit amet'];
  expect(splitLine(str, 12)).toEqual(expected);
});

it('should return a single element array if the string is shorter than the length', () => {
  const str = 'test string';
  const expected = [str];
  expect(splitLine(str, 20)).toEqual(expected);
});
