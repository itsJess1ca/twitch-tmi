import { formatChannelName } from '../utils/channel';
import { formatUsername } from '../utils/format-username';
import { __sendCommand } from '../client/client.send-command';
import { __event$__ } from '../client/client';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';

export function ban({channel, username, reason = ""}: BanParams) {
  channel = formatChannelName(channel);
  username = formatUsername(username);

  return __sendCommand(channel, `/ban ${username} ${reason}`, (resolve, reject) => {
      __event$__
        .filter(event => event.type === '_promiseBan')
        .take(1)
        .subscribe(event => {
          if (!event.error) {
            resolve([channel, username, reason]);
          } else {
            reject(event.error);
          }
        });
  });
}
export interface BanParams {
  channel: string;
  username: string;
  reason: string;
}

export function timeout({channel, username, seconds = 300, reason = ""}: TimeoutParams) {
  channel = formatChannelName(channel);
  username = formatUsername(username);

  return __sendCommand(channel, `/timeout ${username} ${seconds} ${reason}`, (resolve, reject) => {
      __event$__
        .filter(event => event.type === '_promiseTimeout')
        .take(1)
        .subscribe(event => {
          if (!event.error) {
            resolve([channel, username, ~~seconds, reason]);
          } else {
            reject(event.error);
          }
        });
  });
}
export interface TimeoutParams {
  channel: string;
  username: string;
  seconds: number;
  reason: string;
}

export const purge = ({channel, username, reason = ""}: BanParams) => timeout({channel, username, reason, seconds: 1});

export function unban({channel, username}: UnbanParams) {
  channel = formatChannelName(channel);
  username = formatUsername(username);

  return __sendCommand(channel, `/unban ${username}`, (resolve, reject) => {
    __event$__
      .filter(event => event.type === '_promiseUnban')
      .take(1)
      .subscribe(event => {
        if (!event.error) {
          resolve([channel, username]);
        } else {
          reject(event.error);
        }
      });
  });
}
export interface UnbanParams {
  channel: string;
  username: string;
}

export function clear({channel}: ClearParams) {
  channel = formatChannelName(channel);

  return __sendCommand(channel, `/clear`, (resolve, reject) => {
    __event$__
      .filter(event => event.type === '_promiseClear')
      .take(1)
      .subscribe(event => {
        if (!event.error) {
          resolve([channel]);
        } else {
          reject(event.error);
        }
      });
  });
}
export interface ClearParams {
  channel: string;
}

