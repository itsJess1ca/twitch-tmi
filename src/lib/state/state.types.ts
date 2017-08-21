// Core Types
export interface SetUsernameAction {
  type: "[Core] Set Username";
  username: string;
}
export interface SetChannelsAction {
  type: "[Core] Set Channels";
  channels: string[];
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

// Channel Types
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

// Connection Types
export interface IncrementReconnectionsAction {
  type: "[Connection] Increment Reconnections";
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
  SetPingTimeoutAction |
  SetPingLoopAction |
  SetLoggingLevelAction |
  OtherAction;

export type ChannelActionTypes =
  AddModeratorAction |
  RemoveModeratorAction |
  SetUserStateAction |
  ClearChannelsAction |
  OtherAction;

export type ConnectionActionTypes =
  IncrementReconnectionsAction |
  ResetReconnectionsAction |
  SetLatencyBaseAction |
  SetCurrentLatencyAction |
  CloseConnectionAction |
  SetReconnectTimerAction |
  OtherAction;
