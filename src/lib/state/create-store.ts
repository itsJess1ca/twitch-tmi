import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { green } from 'chalk';
import { logger } from '../logger';
import { ChannelActionTypes, ConnectionActionTypes, CoreActionTypes } from './state.types';
import { CoreState } from './core/core.reducer';
import { ConnectionState } from './connection/connection.reducer';
import { ChannelState } from './channel/channel.reducer';
export function createStore(reducers: Reducers) {
  const state$ = new BehaviorSubject<any>({});

  let obj = {};
  for (const reducer in reducers) {
    if (reducers.hasOwnProperty(reducer)) {
      obj[reducer] = reducers[reducer](undefined, {});
    }
  }
  state$.next(obj);

  return {
    dispatch: <ReducerName extends keyof ReducerTypesMap>(reducer: ReducerName, action: ReducerTypesMap[ReducerName]) => {
      logger.debug(green(action.type));
      const obj: {[reducer: string]: any} = {};
      obj[reducer] = reducers[reducer](state$.value[reducer], action);
      state$.next(Object.assign({}, state$.value, obj));
      return obj[reducer];
    },
    get: <ReducerName extends keyof ReducerStateMap>(reducer: ReducerName): ReducerStateMap[ReducerName] => state$.value[reducer],
    state$: state$
  };
}

export interface ReducerTypesMap {
  "core": CoreActionTypes;
  "channel": ChannelActionTypes;
  "connection": ConnectionActionTypes;
}

interface ReducerStateMap {
  "core": CoreState;
  "connection": ConnectionState;
  "channel": ChannelState;
}

interface Reducers {
  [name: string]: (...args) => any;
}
