import { ParsedMessage } from '../../parser/message';
import { __event$__, store } from '../client';
import { addModerator, removeModerator } from '../../state/channel/channel.actions';
import { Subject } from "rxjs/Subject";
import { ClientEventMap } from '../event-types';
import { logger } from '../../logger';
import { buildEvent } from '../../utils/build-event';

export function handleJtvMessages(message: ParsedMessage, event$: Subject<any>) {
  const commands = {
    "MODE": () => {
      if (message.content === "+o") {
        // Add username to the moderators...
        if (!store.get('channel')[message.params[2]]) {
          store.dispatch('channel', addModerator(message.channel, message.params[2]));
        }
        __event$__.next(buildEvent('mod', {
          channel: message.channel,
          username: message.params[2]
        }, message.raw));

      } else if (message.content === "-o") {
        // Remove username from the moderators...
        store.dispatch('channel', removeModerator(message.channel, message.content));

        event$.next(buildEvent('unmod', {channel: message.channel, username: message.params[2]}, message.raw));
      }
    }
  };
  commands[message.command] ? commands[message.command]() : (() => {
    logger.info(`Could not parse message from jtv: 
       ${JSON.stringify(message, null, 2)}
      `);
  })();
}
