import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { green } from 'chalk';
import { logger } from '../logger';
import { Reducers, ReducerStateMap, ReducerTypesMap } from './store.types';

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
