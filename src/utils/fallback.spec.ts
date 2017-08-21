import { fallback } from './fallback';

it('should fallback to the first valid variable', () => {
  const var1 = 'var1';
  const var2 = 'var2';
  const var3 = 'var3';
  let var4;
  let var5;

  expect(fallback(var1, var2, var3, var4, var5)).toEqual(var1);
  expect(fallback(var4, var3, var2, var1)).toEqual(var3);
  expect(fallback(var4, var5, var3, var2, var1)).toEqual(var3);
});
