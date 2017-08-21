import { ClientEventMap } from '../lib/client/event-types';

export const buildEvent = <MessageType extends keyof ClientEventMap>(type: MessageType, event: ClientEventMap[MessageType] = {}) =>
  Object.assign({type: type, raw: null}, event);
