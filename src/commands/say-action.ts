import { formatChannelName } from '../../../utils/channel';
import { __sendMessage } from '../client/client.send-message';

export function sayAction(channel: string, message: string) {
  channel = formatChannelName(channel);
  message = `\u0001ACTION ${message}\u0001`;

  return __sendMessage(channel, message, (resolve, reject) => {
    // At this time, there is no possible way to detect if a message has been sent has been eaten
    // by the server, so we can only resolve the Promise.
    resolve([channel, message]);
  });
}
