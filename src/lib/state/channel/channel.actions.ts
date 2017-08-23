import {
  AddChannelAction,
  AddModeratorAction, ClearChannelsAction, ClearModeratorsAction, RemoveModeratorAction,
  SetUserStateAction
} from '../state.types';

export function addChannel(channel: string): AddChannelAction {
  return {
    type: '[Channel] Add Channel',
    channel
  };
}

export function addModerator(channel: string, names: string | string[]): AddModeratorAction {
  return {
    type: "[Channel] Add Moderator",
    payload: {
      channel,
      names
    }
  };
}

export function removeModerator(channel: string, names: string | string[]): RemoveModeratorAction {
  return {
    type: "[Channel] Remove Moderator",
    payload: {
      channel,
      names
    }
  };
}

export function clearModerators(channel: string): ClearModeratorsAction {
  return {
    type: "[Channel] Clear Moderators",
    channel
  };
}

export function setUserState(channel: string, userstate: any): SetUserStateAction {
  return {
    type: '[Channel] Set User State',
    payload: {
      channel,
      userstate
    }
  };
}

export function clearChannels(): ClearChannelsAction {
  return {
    type: '[Channel] Clear Channels'
  };
}
