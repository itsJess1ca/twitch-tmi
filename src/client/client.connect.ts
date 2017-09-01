import * as WebSocket from 'ws';
import { ClientOptions, store } from './client';
import { Subject } from 'rxjs/Subject';
import { clearChannels } from '../state/channel/channel.actions';
import { closeConnection, incrementReconnections, setReconnectTimer } from '../state/connection/connection.actions';
import { ClientEventMap } from './event-types';
import { logger } from '../logger';
import { buildEvent } from '../utils/build-event';
import { Observable } from 'rxjs/Observable';

export let __ws__;
let options: ClientOptions;

export const ClientConnect = function ClientConnect(opts: ClientOptions, message$: Subject<string>, event$: Subject<any>) {
  options = opts;
  let reconnecting = false;

  let reconnectTimer = opts.connection.reconnectInterval * opts.connection.reconnectDecay;
  if (reconnectTimer >= opts.connection.maxReconnectInterval) {
    reconnectTimer = opts.connection.maxReconnectInterval;
  }
  store.dispatch('connection', setReconnectTimer(reconnectTimer));

  function connect() {
    __ws__ = new WebSocket(`${options.connection.secure ? 'wss' : 'ws'}://${options.connection.server}:${options.connection.port}/`, 'irc');

    __ws__.on('open', () => {
      logger.info(`Connecting to ${opts.connection.server}:${opts.connection.port}`);
      event$.next(buildEvent('connecting', {port: opts.connection.port, address: opts.connection.server}, null));

      event$.next(buildEvent('logon', {}, null));
      __ws__.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      __ws__.send(`PASS ${options.identity.password}`);
      __ws__.send(`NICK ${options.identity.username}`);
      __ws__.send(`USER ${options.identity.username} 8 * :${options.identity.username}`);
    });

    __ws__.on('close', _onClose);
    __ws__.on('error', _onError);
    __ws__.on('message', (message) => message$.next(message));

    __ws__.on('ping', () => __ws__.send('pong'));
  }

  function _onError() {
    store.dispatch('channel', clearChannels());

    // Stop our internal ping check
    clearInterval(store.get('core').pingLoop);
    clearTimeout(store.get('core').pingTimeout);

    event$.next(buildEvent('disconnected', {
      reason: __ws__ === null ? 'Connection Closed' : 'Unable to connect'
    }, null));

    attemptReconnect();
  }

  function _onClose() {
    store.dispatch('channel', clearChannels());

    // Stop our internal ping check
    clearInterval(store.get('core').pingLoop);
    clearTimeout(store.get('core').pingTimeout);


    let reason = 'Connection Closed';
    if (store.get('connection').wasCloseCalled) {
      // User manually closed connection, don't reconnect

      store.dispatch('connection', closeConnection(false));
      logger.info(reason);
      event$.next(buildEvent('disconnected', {reason}, null));
    } else {
      // Got disconnected from the server
      event$.next(buildEvent('disconnected', {reason}, null));
      attemptReconnect();
    }
  }

  function attemptReconnect() {
    if (opts.connection.reconnect && store.get('connection').reconnections === opts.connection.maxReconnectAttempts) {
      event$.next(buildEvent('maxreconnect', {}, null));
      logger.error(`Maximum reconnection attempts (${opts.connection.maxReconnectAttempts}) reached`);
    }
    if (opts.connection.reconnect && !reconnecting && store.get('connection').reconnections <= opts.connection.maxReconnectAttempts - 1) {
      reconnecting = true;
      store.dispatch('connection', incrementReconnections());
      logger.error(`Reconnecting in ${Math.round(reconnectTimer / 1000)} seconds`);
      event$.next(buildEvent('reconnect', {}, null));
      setTimeout(() => {
        reconnecting = false;
        connect();
      }, reconnectTimer);
    }

    __ws__ = null;
  }

  return connect;
};
