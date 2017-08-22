import { createStore } from './create-store';
import { CORE_INITIAL_STATE, coreReducer } from './core/core.reducer';
import { setChannels, setPingTimeout, setUsername } from './core/core.actions';
import { channelReducer } from './channel/channel.reducer';
import { addModerator, removeModerator } from './channel/channel.actions';

it('should intialize with initial state', () => {
  const store = createStore({core: coreReducer});
  expect(store.get('core')).toEqual(CORE_INITIAL_STATE);
});

it('should update username', () => {
  const store = createStore({core: coreReducer});

  expect(store.get('core').username).toEqual(null);

  store.dispatch('core', setUsername('test'));

  expect(store.get('core').username).toEqual('test');
});

it('should update channels', () => {
  const store = createStore({core: coreReducer});

  expect(store.get('core').channels).toEqual([]);

  store.dispatch('core', setChannels(['test']));

  expect(store.get('core').channels).toEqual(['test']);
});

it('should update pingTimeout', () => {
  const store = createStore({core: coreReducer});

  expect(store.get('core').pingTimeout).toBeUndefined();

  const pingTimeout = setTimeout(() => {}, 10);
  store.dispatch('core', setPingTimeout(pingTimeout));

  expect(store.get('core').pingTimeout).toEqual(pingTimeout);
});

it('should handle moderators for multiple channels', () => {
  const store = createStore({core: coreReducer, channel: channelReducer});

  expect(store.get('channel')['test']).toBeUndefined();
  expect(store.get('channel')['test2']).toBeUndefined();

  store.dispatch('channel', addModerator('test', 'mod1'));
  store.dispatch('channel', addModerator('test2', ['mod2', 'mod3']));

  expect(store.get('channel')['test']).toBeDefined();
  expect(store.get('channel')['test2']).toBeDefined();
  expect(store.get('channel')['test'].moderators).toEqual(['mod1']);
  expect(store.get('channel')['test2'].moderators).toEqual(['mod2', 'mod3']);
});

it('should be able to remove moderators from a channel', () => {

  const store = createStore({core: coreReducer, channel: channelReducer});
  store.dispatch('channel', addModerator('test', ['mod1', 'mod2', 'mod3', 'mod4']));
  expect(store.get('channel')['test'].moderators).toEqual(['mod1', 'mod2', 'mod3', 'mod4']);

  store.dispatch('channel', removeModerator('test', 'mod1'));
  expect(store.get('channel')['test'].moderators).toEqual(['mod2', 'mod3', 'mod4']);

  store.dispatch('channel', removeModerator('test', ['mod2', 'mod3']));
  expect(store.get('channel')['test'].moderators).toEqual(['mod4']);
});

// TODO: More tests for each reducer action
