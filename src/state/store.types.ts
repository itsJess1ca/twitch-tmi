
import { ChannelActionTypes, ConnectionActionTypes, CoreActionTypes } from './state.types';
import { CoreState } from './core/core.reducer';
import { ConnectionState } from './connection/connection.reducer';
import { ChannelState } from './channel/channel.reducer';

export interface ReducerTypesMap {
  "core": CoreActionTypes;
  "channel": ChannelActionTypes;
  "connection": ConnectionActionTypes;
}

export interface ReducerStateMap {
  "core": CoreState;
  "connection": ConnectionState;
  "channel": ChannelState;
}

export interface Reducers {
  [name: string]: (...args) => any;
}
