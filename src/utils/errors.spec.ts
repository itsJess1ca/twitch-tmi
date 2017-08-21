import { CannotCloseWS, InvalidOAuth } from './errors';

it('should return the correct strings for our error messages', () => {
  expect(InvalidOAuth).toEqual("Invalid oauth string provided. Get one at http://twitchapps.com/tmi/");
  expect(CannotCloseWS).toEqual('Unable to disconnect from server. Socket is either not open or already closing.');
});
