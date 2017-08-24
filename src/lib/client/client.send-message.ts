import { PromiseCB } from './client.send-command';
import { __ws__ } from './client.connect';
import { isJustinfan, isRegex } from '../../utils/type-checks';
import { __event$__, store } from './client';
import { setUserState } from '../state/channel/channel.actions';
import { splitLine } from '../../utils/split-line';
import { formatChannelName } from '../../utils/channel';
import { emoteRegex } from '../parser/emote-regex';
import { emoteString } from '../parser/emote-string';
import { parseEmotes } from '../parser/emotes';
import { transformEmotes } from '../parser/transform-emotes';
import { logger } from '../logger';
import { buildEvent } from '../../utils/build-event';

export function __sendMessage(channel: string, message: string, cb: PromiseCB) {
  const latency = store.get('connection').currentLatency;
  const delay = latency <= 600 ? 600 : latency + 100;
  return new Promise((resolve, reject) => {
    if (__ws__ !== null && __ws__.readyState !== 2 && __ws__.readyState !== 3 && !isJustinfan(store.get('core').username)) {
      if (!store.get('channel')[formatChannelName(channel)].userstate)
        store.dispatch('channel', setUserState(formatChannelName(channel), {}));

      if (message.length >= 500) {
        const msg = splitLine(message, 500);
        message = msg[0];

        setTimeout(() => {
          __sendMessage(channel, msg[1], () => {});
        }, 350);
      }

      __ws__.send(`PRIVMSG ${formatChannelName(channel)} :${message}`);

      const emotes = {};
      const emoteSets = store.get('core').emoteSets;
      if (emoteSets) {
        logger.info('emoteSets', emoteSets);
        Object.keys(emoteSets)
          .forEach((id) => {
            emoteSets[id].forEach((emote) => {
              if (isRegex(emote.code)) {
                return emoteRegex(message, emote.code, emote.id, emotes);
              }
              emoteString(message, emote.code, emote.id, emotes);
            });
          });
      }

      //tslint:disable-next-line:max-line-length
      const userstate = Object.assign({}, store.get('channel')[formatChannelName(channel)].userstate, parseEmotes({ emotes: transformEmotes(emotes) || null }));

      if (message.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)) {
        userstate['message-type'] = 'action';
        //tslint:disable-next-line:max-line-length
        logger.info(`[${formatChannelName(channel)}] *<${store.get('core').username}>: ${message.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1]}`);
        __event$__.next(buildEvent('action', {
          channel: channel,
          message: message.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1],
          self: true,
          userstate
        }, message));
        __event$__.next(buildEvent('message', {
          channel: channel,
          message: message.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1],
          self: true,
          userstate
        }, message));
      } else {
        userstate['message-type'] = 'action';
        //tslint:disable-next-line:max-line-length
        logger.info(`[${formatChannelName(channel)}] <${store.get('core').username}>: ${message}`);
        __event$__.next(buildEvent('chat', {
          channel: channel,
          message: message,
          self: true,
          userstate
        }, message));
        __event$__.next(buildEvent('message', {
          channel: channel,
          message: message,
          self: true,
          userstate
        }, message));
      }
      cb(resolve, reject);
    } else {
      reject('Not connected to server.');
    }
  });
}
