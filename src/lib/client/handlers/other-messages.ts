import { ParsedMessage } from '../../parser/message';
import { noop } from '../../../utils/noop';
import { store } from '../client';
import { isJustinfan } from '../../../utils/type-checks';
import { Subject } from 'rxjs/Subject';
import { ClientEventMap } from '../event-types';
import { logger } from '../../logger';

export function handleOtherMessages(message: ParsedMessage, event$: Subject<any>) {
  const commands = {
    "353" : () => {
      logger.info(message.params[2], message.params[3].split(" "));
    },
    "JOIN": () => {
      if (isJustinfan(store.get('core').username) && store.get('core').username === message.prefix.split("!")[0]) {
        // Joined the channel as a justinfan user

        logger.info(`Joined ${message.channel}`);
      }

      if (store.get('core').username !== message.prefix.split("!")[0]) {
        // Someone else joined the channel, just emit the join event..

        logger.info(`${message.prefix.split("!")[0]} Joined ${message.channel}`);
      }
    },
    "PRIVMSG": () => {
      // Add username (lowercase) to the tags..
      message.tags['username'] = message.prefix.split("!")[0];

      if (message.tags['username'] === "jtv") {
        // Message from JTV..

        if (message.content.includes("hosting you for")) {
          // Someone is hosting the channel and the message contains how many viewers..


        } else if (message.content.includes("hosting you")) {
          // Some is hosting the channel, but no viewer(s) count provided in the message..

        }
      } else {
        // Message is an action (/me <message>)..

        if (message.content.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)) {
          message.tags["message-type"] = "action";

          /*this.emits(["action", "message"], [
            [chan, message.tags, msg.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1], false],
            [chan, message.tags, msg.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1], false]
          ]);*/
        } else {
          if (message.tags.hasOwnProperty("bits")) {
            // Message is a cheer

          } else {
            // Message is a regular chat message..

            message.tags["message-type"] = "chat";
            logger.info(`[${message.channel}] <${message.tags['username']}>: ${message.content}`);
          }
        }
      }
    }
  };
  commands[message.command] ? commands[message.command]() : noop();
}
