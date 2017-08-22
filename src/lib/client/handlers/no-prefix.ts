import { ParsedMessage } from '../../parser/message';
import { ws } from '../client.connect';
import { store } from '../client';
import { Subject } from "rxjs/Subject";
import { setCurrentLatency } from '../../state/connection/connection.actions';
import { logger } from '../../logger';
import { buildEvent } from '../../../utils/build-event';

export function HandleNoPrefixMessage(message: ParsedMessage, event$: Subject<any>) {
  const commands = {
    "PING": () => {
      if (ws !== null && ws.readyState !== 2 && ws.readyState !== 3) {
        ws.send("PONG");
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
