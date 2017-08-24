import { ClientEventMap } from '../lib/client/event-types';

export const buildEvent = <MessageType extends keyof ClientEventMap>(
  type: MessageType,
  event: ClientEventMap[MessageType],
  raw: string
) => Object.assign({type: type, raw}, event);
