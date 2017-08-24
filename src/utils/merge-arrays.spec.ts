
import { mergeArrays } from './merge-arrays';

it('should merge number arrays without duplicates', () => {
  const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const arr2 = [5, 10, 15, 20];
  const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];
  expect(mergeArrays<number>(arr1, arr2)).toEqual(expected);
});
it('should merge string arrays without duplicates', () => {
  const arr1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const arr2 = ['5', '10', '15', '20'];
  const expected = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20'];
  expect(mergeArrays<string>(arr1, arr2)).toEqual(expected);
});
it('should merge object arrays without duplicates', () => {
  const arr1 = [
    {test: 'test'},
    {testing: 'test'},
    {test: 'testing'},
    {test: 'testing', testing: 'test'},
  ];
  const arr2 = [
    {foo: 'bar'},
    {bar: 'foo'},
    {test: 'test'},
    {testing: 'test'}
  ];
  const expected = [
    {test: 'test'},
    {testing: 'test'},
    {test: 'testing'},
    {test: 'testing', testing: 'test'},
    {foo: 'bar'},
    {bar: 'foo'},
  ];
  expect(mergeArrays<any>(arr1, arr2)).toEqual(expected);
});
