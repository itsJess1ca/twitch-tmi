import { formatChannelName } from './channel';

it('should return a valid channel string', () => {
  expect(formatChannelName('test')).toEqual('#test');
  expect(formatChannelName('TEST')).toEqual('#test');
  expect(formatChannelName('#test')).toEqual('#test');
  expect(formatChannelName('#Test')).toEqual('#test');
});
