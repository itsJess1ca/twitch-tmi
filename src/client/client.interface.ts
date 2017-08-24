import { ParsedMessage } from '../parser/message';
import { ClientEventMap } from './event-types';
import { Observable } from 'rxjs/Observable';
import { PromiseCB } from './client.send-command';

export interface ClientInterface {
  connect: (() => void);

  disconnect: (() => Promise<void>);

  on: <MessageType extends keyof ClientEventMap>(type: MessageType) =>
    Observable<ClientEventMap[MessageType] & {type: MessageType; raw: ParsedMessage; }>;

  __sendCommand: <T>(channel: string, command: string, callback: PromiseCB) => Promise<T>;
}
