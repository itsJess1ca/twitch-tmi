import { CoreActionTypes } from '../state.types';
import { LoggingLevels } from '../../logger';

export interface CoreState {
  username: string;
  channels: string[];
  pingTimeout?: NodeJS.Timer;
  pingLoop?: NodeJS.Timer;
  loggingLevel: LoggingLevels;
}

export const CORE_INITIAL_STATE: CoreState = {username: null, channels: [], loggingLevel: "info"};

export function coreReducer(s: CoreState = CORE_INITIAL_STATE, action: CoreActionTypes): CoreState {
  switch (action.type) {
    case "[Core] Set Username":
        return Object.assign({}, s, {username: action.username});
    case "[Core] Set Channels":
        return Object.assign({}, s, {channels: action.channels});
    case "[Core] Set Ping Timeout":
        return Object.assign({}, s, {pingTimeout: action.timer});
    case "[Core] Set Ping Loop":
        return Object.assign({}, s, {pingLoop: action.timer});
    case "[Core] Set Logging Level":
        return Object.assign({}, s, {loggingLevel: action.level});
    default:
        return s;
  }
}
