import { CoreActionTypes } from '../state.types';
import { LoggingLevels } from '../../logger';
import { ClientOptions } from '../../client/client';

export interface CoreState {
  username: string;
  channels: string[];
  pingTimeout?: NodeJS.Timer;
  pingLoop?: NodeJS.Timer;
  loggingLevel: LoggingLevels;
  lastJoinedChannel?: string;
  options?: ClientOptions;
  rawEmotes?: string;
  emoteSets?: {
    [key: string]: [{
      code: string;
      id: number;
    }]
  };
  rateLimit?: number;
}

export const CORE_INITIAL_STATE: CoreState = {username: null, channels: [], loggingLevel: "info", emoteSets: {}, rateLimit: 300};

export function coreReducer(s: CoreState = CORE_INITIAL_STATE, action: CoreActionTypes): CoreState {
  switch (action.type) {
    case "[Core] Set Username":
      return Object.assign({}, s, {username: action.username});
    case "[Core] Set RateLimit":
      return Object.assign({}, s, {rateLimit: action.payload.rateLimit});
    case "[Core] Set Channels":
      return Object.assign({}, s, {channels: action.channels});
    case "[Core] Set Options":
      return Object.assign({}, s, {options: action.options});
    case "[Core] Set Ping Timeout":
      return Object.assign({}, s, {pingTimeout: action.timer});
    case "[Core] Set Ping Loop":
      return Object.assign({}, s, {pingLoop: action.timer});
    case "[Core] Set Logging Level":
      return Object.assign({}, s, {loggingLevel: action.level});
    case "[Core] Set Last Joined Channel":
      return Object.assign({}, s, {lastJoinedChannel: action.channel});
    case "[Core] Set Raw EmoteSets String":
      return Object.assign({}, s, {rawEmotes: action.payload});
    case "[Core] Set EmoteSets":
      return Object.assign({}, s, {emoteSets: action.payload});
    default:
      return s;
  }
}
