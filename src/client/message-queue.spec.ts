import { createStore } from '../state/create-store';
import { coreReducer } from '../state/core/core.reducer';
import { setRateLimit } from '../state/core/core.actions';
import { messageQueue } from './message-queue';

let store;
beforeEach(() => {
  store = createStore({core: coreReducer});
});

it('should emit a message after the rate limit set', (done) => {
  store.dispatch('core', setRateLimit(100));
  const messageQueue$ = messageQueue(store);
  const fn = jest.fn();
  messageQueue$.messages.subscribe(fn);
  messageQueue$.addMessage('test');

  setTimeout(() => {
    expect(fn).toHaveBeenCalledWith('test');
    done();
  }, 100);
});

it('should emit multiple messages rate limited', (done) => {
  store.dispatch('core', setRateLimit(100));
  const messageQueue$ = messageQueue(store);
  const fn = jest.fn();
  messageQueue$.messages.subscribe(fn);
  messageQueue$.addMessage('test');
  messageQueue$.addMessage('test');

  setTimeout(() => {
    expect(fn).toHaveBeenCalledWith('test');
    expect(fn).toHaveBeenCalledTimes(1);
  }, 100);
  setTimeout(() => {
    expect(fn).toHaveBeenCalledWith('test');
    expect(fn).toHaveBeenCalledTimes(2);
    done();
  }, 215);
});
