import { ChannelActionTypes } from '../state.types';

export interface ChannelState {
  [channel: string]: ChannelDefaultState;
}

export interface ChannelDefaultState {
  moderators: string[];
  userstate?: any;
}

export const CHANNEL_INITIAL_STATE: ChannelState = {};
export const CHANNEL_INITIAL_SUB_STATE: ChannelDefaultState = {moderators: [], userstate: {}};

export function channelReducer(s: ChannelState = CHANNEL_INITIAL_STATE, action: ChannelActionTypes): ChannelState {
  let newState = Object.assign({}, s);
  switch (action.type) {
    case "[Channel] Add Channel":
      if (!newState[action.channel]) newState = initializeChannel(newState, action.channel);

      return newState;

    case "[Channel] Remove Channel":
      if (newState[action.channel]) delete newState[action.channel];

      return newState;

    case "[Channel] Add Moderator":
      if (!newState[action.payload.channel]) newState = initializeChannel(newState, action.payload.channel);

      newState[action.payload.channel] = Object.assign({}, newState[action.payload.channel], {
        moderators: newState[action.payload.channel].moderators.concat(action.payload.names)
      });

      return newState;

    case "[Channel] Remove Moderator":
      let names = Array.isArray(action.payload.names) ? action.payload.names : [].concat(action.payload.names);

      if (!newState[action.payload.channel]) newState = initializeChannel(newState, action.payload.channel);
      newState[action.payload.channel] = Object.assign({}, newState[action.payload.channel], {
        moderators: newState[action.payload.channel].moderators.filter(mod => !action.payload.names.includes(mod))
      });
      return newState;

    case "[Channel] Clear Moderators":
      if (!newState[action.channel]) newState = initializeChannel(newState, action.channel);
      newState[action.channel] = Object.assign({}, newState[action.channel], {
        moderators: []
      });
      return newState;

    case "[Channel] Set User State":
      if (!newState[action.payload.channel]) newState = initializeChannel(newState, action.payload.channel);
      newState[action.payload.channel] = Object.assign({}, newState[action.payload.channel], {
        userstate: action.payload
      });
      return newState;

    case "[Channel] Clear Channels":
      return CHANNEL_INITIAL_STATE;

    default:
      return s;
  }
}

function initializeChannel(state: ChannelState, channel: string) {
  const newChannel = {};
  newChannel[channel] = CHANNEL_INITIAL_SUB_STATE;
  return Object.assign({}, state, newChannel);
}
