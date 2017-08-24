import { ClientInterface } from '../client/client.interface';
import { formatChannelName } from '../../../utils/channel';
import { __event$__ } from '../client/client';

export function part(client: ClientInterface, channel: string) {
  return client.__sendCommand<string>(null, `PART ${formatChannelName(channel)}`, (resolve, reject) => {
    __event$__
      .filter(event => event.type === '_promisePart')
      .take(1)
      .subscribe(event => {
        if (!event.error) {
          resolve(channel);
        } else {
          reject(event.error);
        }
      });
  });
}
