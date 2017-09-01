import * as request from 'request';
import { CoreOptions, RequiredUriUrl, Headers } from 'request';
import { Observable } from 'rxjs/Observable';
import { store } from '../client/store';
import { fallback } from '../utils/fallback';
import { isURL } from '../utils/type-checks';

export function _TwitchApi<T>(options: TwitchApiOptions) {
  let url = options.url;
  if (!isURL(url)) {
    url = url.charAt(0) === '/' ? `https://api.twitch.tv/kraken${url}` : `https://api.twitch.tv/kraken/${url}`;
  }

  const opts: CoreOptions & RequiredUriUrl = {
    method: options.method || 'GET',
    url: url,
    headers: Object.assign({}, options.headers, {
      "Authorization": `OAuth ${fallback(store.get('core').options.identity.password).replace('oauth:', '')}`,
      'Client-ID': store.get('core').options.options.clientId
    })
  };
  return new Observable<T>((observer) => {
    request(opts, (err, res, body) => {
      if (err) return observer.error(err);
      observer.next(body);
      observer.complete();
    });
  });
}

export interface TwitchApiOptions {
  url: string;
  headers?: Headers;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}
