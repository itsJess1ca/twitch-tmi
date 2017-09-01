
import { formatUsername } from './format-username';

it('should format a username correctly', () => {
  expect(formatUsername('Username')).toEqual('username');
  expect(formatUsername('#Username')).toEqual('username');
  expect(formatUsername('username')).toEqual('username');
});

it('should return an empty string if the name param is not a string', () => {
  const name: any = [{'test': 'test'}];
  expect(formatUsername(name)).toEqual("");
  expect(formatUsername(null)).toEqual("");
});
