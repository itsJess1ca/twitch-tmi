import {
  CloseConnectionAction, IncrementReconnectionsAction, ResetReconnectionsAction, SetCurrentLatencyAction,
  SetLatencyBaseAction,
  SetReconnectTimerAction
} from '../state.types';

export function setLatencyBase(latency: Date): SetLatencyBaseAction {
  return {
    type: "[Connection] Set Latency Base",
    payload: latency
  };
}

export function incrementReconnections(): IncrementReconnectionsAction {
  return {
    type: '[Connection] Increment Reconnections'
  };
}
export function resetReconnections(): ResetReconnectionsAction {
  return {
    type: '[Connection] Reset Reconnections'
  };
}

export function setCurrentLatency(latency: number): SetCurrentLatencyAction {
  return {
    type: "[Connection] Set Current Latency",
    payload: latency
  };
}
export function setReconnectTimer(timer: number): SetReconnectTimerAction {
  return {
    type: "[Connection] Set Reconnect Timer",
    payload: timer
  };
}

export function closeConnection(calledManually: boolean): CloseConnectionAction {
  return {
    type: "[Connection] Close Connection",
    payload: calledManually
  };
}
