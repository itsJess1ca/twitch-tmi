import { ChannelActionTypes, ConnectionActionTypes } from '../state.types';

export interface ConnectionState {
  latency: Date;
  currentLatency: number;
  wasCloseCalled: boolean;
  reconnectTimer: number;
  reconnections: number;
}

export const CONNECTION_INITIAL_STATE: ConnectionState = {
  latency: new Date(),
  currentLatency: 0,
  wasCloseCalled: false,
  reconnectTimer: 1000,
  reconnections: 0
};

export function connectionReducer(s: ConnectionState = CONNECTION_INITIAL_STATE, action: ConnectionActionTypes): ConnectionState {
  switch (action.type) {
    case "[Connection] Increment Reconnections":
      return Object.assign({}, s, {reconnections: s.reconnections + 1});

    case "[Connection] Reset Reconnections":
      return Object.assign({}, s, {reconnections: 0});

    case "[Connection] Set Latency Base":
      return Object.assign({}, s, {latency: action.payload});

    case "[Connection] Set Current Latency":
      return Object.assign({}, s, {currentLatency: action.payload});

    case "[Connection] Set Reconnect Timer":
        return Object.assign({}, s, {reconnectTimer: action.payload});

    case "[Connection] Close Connection":
      return Object.assign({}, s, {wasCloseCalled: action.payload});

    default:
      return s;
  }
}

