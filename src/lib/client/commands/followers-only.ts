import { ClientInterface } from '../client.interface';
import { fallback } from '../../../utils/fallback';
import { __event$__ } from '../client';

export function followersOnly(client: ClientInterface, channel: string, minutes: number) {
  return client.__sendCommand(channel, `/followers ${fallback(minutes, 30)}`, (resolve, reject) => {
    __event$__
      .filter(event => event.type === '_promiseFollowers')
      .take(1)
      .subscribe((err) => {
        if (!err) {
          resolve(channel);
        } else {
          reject(err);
        }
      });
  });
}
export function followersOnlyOff(client: ClientInterface, channel: string) {
  return client.__sendCommand(channel, `/followersoff`, (resolve, reject) => {
    __event$__
      .filter(event => event.type === '_promiseFollowersOff')
      .take(1)
      .subscribe((err) => {
        if (!err) {
          resolve(channel);
        } else {
          reject(err);
        }
      });
  });
}
