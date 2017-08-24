// Core Types
import { ClientOptions } from '../client/client';

export interface SetUsernameAction {
  type: "[Core] Set Username";
  username: string;
}
export interface SetChannelsAction {
  type: "[Core] Set Channels";
  channels: string[];
}
export interface SetOptionsAction {
  type: "[Core] Set Options";
  options: ClientOptions;
}
export interface SetLastJoinedChannelAction {
  type: "[Core] Set Last Joined Channel";
  channel: string;
}
export interface SetPingTimeoutAction {
  type: "[Core] Set Ping Timeout";
  timer: NodeJS.Timer;
}
export interface SetPingLoopAction {
  type: "[Core] Set Ping Loop";
  timer: NodeJS.Timer;
}
export interface SetLoggingLevelAction {
  type: "[Core] Set Logging Level";
  level: string;
}
export interface SetRawEmotesStringAction {
  type: "[Core] Set Raw EmoteSets String";
  payload: string;
}export interface SetEmoteSetsAction {
  type: "[Core] Set EmoteSets";
  payload: {
    [key: string]: [{
      code: string;
      id: number;
    }]
  };
}

// Channel Types
export interface AddChannelAction {
  type: "[Channel] Add Channel";
  channel: string;
}
export interface RemoveChannelAction {
  type: "[Channel] Remove Channel";
  channel: string;
}
export interface AddModeratorAction {
  type: "[Channel] Add Moderator";
  payload: {
    channel: string;
    names: string | string[];
  };
}
export interface RemoveModeratorAction {
  type: "[Channel] Remove Moderator";
  payload: {
    channel: string;
    names: string | string[];
  };
}
export interface SetUserStateAction {
  type: "[Channel] Set User State";
  payload: any;
}

export interface ClearChannelsAction {
  type: "[Channel] Clear Channels";
}

export interface ClearModeratorsAction {
  type: "[Channel] Clear Moderators";
  channel: string;
}

// Connection Types
export interface IncrementReconnectionsAction {
  type: "[Connection] Increment Reconnections";
}
export interface ShouldReconnectAction {
  type: "[Connection] Set shouldReconnect Status";
  payload: boolean;
}
export interface ResetReconnectionsAction {
  type: "[Connection] Reset Reconnections";
}
export interface SetLatencyBaseAction {
  type: "[Connection] Set Latency Base";
  payload: Date;
}
export interface SetCurrentLatencyAction {
  type: "[Connection] Set Current Latency";
  payload: number;
}
export interface CloseConnectionAction {
  type: "[Connection] Close Connection";
  payload: boolean;
}
export interface SetReconnectTimerAction {
  type: "[Connection] Set Reconnect Timer";
  payload: number;
}


export interface OtherAction {
  type: "Unknown Action";
}

export type CoreActionTypes =
  SetUsernameAction |
  SetChannelsAction |
  SetLastJoinedChannelAction |
  SetOptionsAction |
  SetPingTimeoutAction |
  SetPingLoopAction |
  SetLoggingLevelAction |
  SetRawEmotesStringAction |
  SetEmoteSetsAction |
  OtherAction;

export type ChannelActionTypes =
  AddChannelAction |
  RemoveChannelAction |
  AddModeratorAction |
  RemoveModeratorAction |
  SetUserStateAction |
  ClearModeratorsAction |
  ClearChannelsAction |
  OtherAction;

export type ConnectionActionTypes =
  IncrementReconnectionsAction |
  ResetReconnectionsAction |
  ShouldReconnectAction |
  SetLatencyBaseAction |
  SetCurrentLatencyAction |
  CloseConnectionAction |
  SetReconnectTimerAction |
  OtherAction;
