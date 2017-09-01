
import { _TwitchApi } from './twitch-api';
import { GetEmoteSetsResponse } from './twitch-types';
import { Observable } from 'rxjs/Observable';
import { store } from '../client/store';
import { setRawEmotesString } from '../state/core/core.actions';

export function getEmoteSets(sets: string): Observable<GetEmoteSetsResponse> {
  store.dispatch('core', setRawEmotesString(sets));
  return _TwitchApi<GetEmoteSetsResponse>({
    method: 'GET',
    url: `/chat/emoticon_images?emotesets=${sets}`
  });
}
