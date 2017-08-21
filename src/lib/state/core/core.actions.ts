import { LoggingLevels } from '../../logger';
import {
  SetChannelsAction, SetLoggingLevelAction, SetPingLoopAction, SetPingTimeoutAction,
  SetUsernameAction
} from '../state.types';

export function setUsername(payload: string): SetUsernameAction {
  return {
    type: "[Core] Set Username",
    username: payload
  };
}
export function setChannels(payload: string[]): SetChannelsAction {
  return {
    type: "[Core] Set Channels",
    channels: payload
  };
}
export function setPingTimeout(payload: NodeJS.Timer): SetPingTimeoutAction {
  return {
    type: "[Core] Set Ping Timeout",
    timer: payload
  };
}
export function setPingLoop(payload: NodeJS.Timer): SetPingLoopAction {
  return {
    type: "[Core] Set Ping Loop",
    timer: payload
  };
}
export function setLoggingLevel(level: LoggingLevels): SetLoggingLevelAction {
  return {
    type: "[Core] Set Logging Level",
    level: level
  };
}
