import { ParsedMessage } from '../../parser/message';
import { noop } from '../../../utils/noop';
import { fallback } from '../../../utils/fallback';
import { ws } from '../client.connect';
import { ClientOptions, store } from '../client';
import { setPingLoop, setPingTimeout, setUsername } from '../../state/core/core.actions';
import { Timer } from '../../timer.class';
import { formatChannelName } from '../../../utils/channel';
import { closeConnection } from '../../state/connection/connection.actions';
import { Subject } from 'rxjs/Subject';
import { ClientEventMap, KnownMsgIds } from '../event-types';
import { logger } from '../../logger';

export function HandleTmiMessage(message: ParsedMessage, connectionSettings, event$: Subject<any>): void {
  const commands = {
    "002": noop,
    "003": noop,
    "004": noop,
    "375": noop,
    "376": noop,
    "CAP": noop,

    // Retrieve username from server..
    "001": () => store.dispatch('core', setUsername(message.params[0])),

    "372": () => {
      console.log('connected to server');
      const pingLoop = setInterval(() => {
        // Make sure the connection is opened before sending the message..
        if (ws !== null && ws.readyState !== 2 && ws.readyState !== 3) {
          ws.send("PING");
        }
        const latency = new Date();
        const pingTimeout = setTimeout(() => {
          if (ws !== null) {
            store.dispatch('connection', closeConnection(false));
            console.error("Ping timeout.");
            ws.close();

            clearInterval(pingLoop);
            clearTimeout(pingTimeout);
          }
        }, fallback(connectionSettings.timeout, 9999));
        store.dispatch('core', setPingTimeout(pingTimeout));
      }, 60000);
      store.dispatch('core', setPingLoop(pingLoop));

      const joinQueue = new Timer(2000);
      // console.log(channels);
      for (const channel of store.get('core').channels) {
        joinQueue.add(function (channel) {
          if (ws !== null && ws.readyState !== 2 && ws.readyState !== 3) {
            ws.send(`JOIN ${formatChannelName(channel)}`);
          }
        }.bind(this, channel));
      }
      joinQueue.run();
    },

    "NOTICE": () => {
      const messageIds = {
        "subs_on": () => {},
        "subs_off": () => {},
        "emote_only_on": () => {},
        "emote_only_off": () => {},
        "r9k_on": () => {},
        "r9k_off": () => {},
        "room_mods": () => {},
        "no_mods": () => {},
        "msg_channel_suspended": () => {},
        "already_banned": () => {},
        "bad_ban_admin": () => {},
        "bad_ban_broadcaster": () => {},
        "bad_ban_global_mod": () => {},
        "bad_ban_self": () => {},
        "bad_ban_staff": () => {},
        "usage_ban": () => {},

        "ban_success:": () => {},

        "usage_clear": () => {},

        "usage_mods": () => {},


      };
      messageIds[message.messageId] ? messageIds[message.messageId]() : noop();
    }
  };
  commands[message.command] ? commands[message.command]() : (() => {
    logger.info(`Could not parse message from tmi.twitch.tv: 
       ${JSON.stringify(message, null, 2)}
      `);
  })();
}
