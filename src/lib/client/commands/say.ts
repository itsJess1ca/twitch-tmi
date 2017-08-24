import { formatChannelName } from '../../../utils/channel';
import { sayAction } from './say-action';
import { __sendCommand } from '../client.send-command';
import { __sendMessage } from '../client.send-message';

export function say(channel: string, message: string) {
  channel = formatChannelName(channel);

  if ((message.startsWith('.') && !message.startsWith('..')) || message.startsWith('/') || message.startsWith('\\')) {
    // Check if the message is an action message
    if (message.substr(1, 3) === 'me ') {
      return sayAction(channel, message.substr(4));
    } else {
      return __sendCommand(channel, message, (resolve, reject) => {
        // At this time, there is no possible way to detect if a message has been sent has been eaten
        // by the server, so we can only resolve the Promise.
        resolve([channel, message]);
      });
    }
  }

  return __sendMessage(channel, message, (resolve, reject) => {
    // At this time, there is no possible way to detect if a message has been sent has been eaten
    // by the server, so we can only resolve the Promise.
    resolve([channel, message]);
  });
}
