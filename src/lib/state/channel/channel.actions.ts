import {
  AddModeratorAction, ClearChannelsAction, RemoveModeratorAction,
  SetUserStateAction
} from '../state.types';

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
