import { LoggingLevels } from '../../logger';
import {
  SetChannelsAction, SetEmoteSetsAction, SetLastJoinedChannelAction, SetLoggingLevelAction, SetOptionsAction,
  SetPingLoopAction,
  SetPingTimeoutAction, SetRawEmotesStringAction,
  SetUsernameAction
} from '../state.types';
import { ClientOptions } from '../../client/client';

export function setUsername(payload: string): SetUsernameAction {
  return {
    type: "[Core] Set Username",
    username: payload
  };
}
export function setOptions(options: ClientOptions): SetOptionsAction {
  return {
    type: "[Core] Set Options",
    options
  };
}

export function setLastJoinedChannel(channel: string): SetLastJoinedChannelAction {
  return {
    type: '[Core] Set Last Joined Channel',
    channel
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

export function setRawEmotesString(emotes: string): SetRawEmotesStringAction {
  return {
    type: '[Core] Set Raw EmoteSets String',
    payload: emotes
  };
}

export function setEmoteSets(emoteSets: {
  [key: string]: [{
    code: string;
    id: number;
  }]
}): SetEmoteSetsAction {
  return {
    type: '[Core] Set EmoteSets',
    payload: emoteSets
  };
}
