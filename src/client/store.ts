import { connectionReducer } from '../state/connection/connection.reducer';
import { channelReducer } from '../state/channel/channel.reducer';
import { coreReducer } from '../state/core/core.reducer';
import { createStore } from '../state/create-store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReducerStateMap, ReducerTypesMap } from '../state/store.types';

export const store = createStore({
  core: coreReducer,
  channel: channelReducer,
  connection: connectionReducer
});
