import { ParsedMessage } from '../../parser/message';
import { store } from '../client';
import { addModerator, removeModerator } from '../../state/channel/channel.actions';
import { Subject } from "rxjs/Subject";
import { ClientEventMap } from '../event-types';
import { logger } from '../../logger';
import { buildEvent } from '../../../utils/build-event';

export function handleJtvMessages(message: ParsedMessage, event$: Subject<any>) {
  const commands = {
    "MODE": () => {
      if (message.content === "+o") {
        // Add username to the moderators...
        store.dispatch('channel', addModerator(message.channel, message.content));

        event$.next(buildEvent('mod', {channel: message.channel, username: message.content}));
      } else if (message.content === "-o") {
        // Remove username from the moderators...
        store.dispatch('channel', removeModerator(message.channel, message.content));

        event$.next(buildEvent('unmod', {channel: message.channel, username: message.content}));
      }
    }
  };
  commands[message.command] ? commands[message.command]() : (() => {
    logger.info(`Could not parse message from jtv: 
       ${JSON.stringify(message, null, 2)}
      `);
  })();
}
