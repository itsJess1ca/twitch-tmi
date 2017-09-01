import { ParsedMessage } from '../../parser/message';
import { __ws__ } from '../client.connect';
import { Subject } from "rxjs/Subject";
import { setCurrentLatency } from '../../state/connection/connection.actions';
import { logger } from '../../logger';
import { buildEvent } from '../../utils/build-event';
import { store } from '../store';

export function HandleNoPrefixMessage(message: ParsedMessage, event$: Subject<any>) {
  const commands = {
    "PING": () => {
      if (__ws__ !== null && __ws__.readyState !== 2 && __ws__.readyState !== 3) {
        __ws__.send("PONG");
      }
      event$.next(buildEvent('ping', {}, message.raw));
    },
    "PONG": () => {
      const currDate = new Date();
      const currentLatency = (currDate.getTime() - store.get('connection').currentLatency) / 1000;
      store.dispatch('connection', setCurrentLatency(currentLatency));

      event$.next(buildEvent('pong', {latency: currentLatency}, message.raw));

      clearTimeout(store.get('core').pingTimeout);
    }
  };
  commands[message.command] ? commands[message.command]() : (() => {
    logger.info(`Could not parse message with no prefix: 
       ${JSON.stringify(message, null, 2)}
      `);
  })();
}
