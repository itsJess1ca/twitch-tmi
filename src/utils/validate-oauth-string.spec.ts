
import { validateOAuthString } from './validate-oauth-string';

it('should return false if the oauth is invalid', () => {
  expect(validateOAuthString('invalidstring')).toEqual(false);
});
it('should return true if the oauth is valid', () => {
  expect(validateOAuthString('oauth:validstring')).toEqual(true);
});
