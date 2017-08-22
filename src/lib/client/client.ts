import { ClientConnect, ws } from './client.connect';
import { fallback } from '../../utils/fallback';
import { justinfan } from '../../utils/justinfan';
import { ParsedMessage, parseMessage } from '../parser/message';
import { ClientOnMessage, SplitMessage } from './client.handle-message';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/from';
import { HandleNoPrefixMessage } from './handlers/no-prefix';
import { HandleTmiMessage } from './handlers/tmi-messages';
import { createStore } from '../state/create-store';
import { coreReducer } from '../state/core/core.reducer';
import { handleJtvMessages } from './handlers/jtv-messages';
import { handleOtherMessages } from './handlers/other-messages';
import { setChannels, setLoggingLevel } from '../state/core/core.actions';
import { channelReducer } from '../state/channel/channel.reducer';
import { connectionReducer } from '../state/connection/connection.reducer';
import { closeConnection } from '../state/connection/connection.actions';
import { CannotCloseWS } from '../../utils/errors';
import { ClientEventMap } from './event-types';
import { logger, LoggingLevels } from '../logger';
import { __sendCommand } from './client.send-command';
import { ClientInterface } from './client.interface';

export const store = createStore({
  core: coreReducer,
  channel: channelReducer,
  connection: connectionReducer
});

export let __event$__;

export function Client(opts: ClientOptions): ClientInterface {

  opts.connection = fallback(opts.connection, {});
  opts.identity = fallback(opts.identity, {});

  const message$ = new Subject<string>();
  __event$__ = new Subject<any>();

  const options = {
    connection: {
      server: fallback(opts.connection.server, 'irc-ws.chat.twitch.tv'),
      port: fallback(opts.connection.port, opts.connection.secure ? 443 : 80),
      reconnect: fallback(opts.connection.reconnect, false),
      maxReconnectAttempts: fallback(opts.connection.maxReconnectAttempts, Infinity),
      maxReconnectInterval: fallback(opts.connection.maxReconnectInterval, 30000),
      reconnectDecay: fallback(opts.connection.reconnectDecay, 1.5),
      reconnectInterval: fallback(opts.connection.reconnectInterval, 1000),
      secure: fallback(opts.connection.secure, false),
      timeout: fallback(opts.connection.timeout, 9999)
    },
    identity: {
      username: fallback(opts.identity.username, justinfan()),
      password: fallback(opts.identity.password, 'oauth:layerone')
    },
    channels: fallback(opts.channels, []),
    options: fallback(opts.options, {})
  } as ClientOptions;

  // Override Logger if set
  if (opts.logger) {
    for (const fn in opts.logger) {
      if (opts.logger.hasOwnProperty(fn)) {
        logger[fn] = opts.logger[fn];
      }
    }
  }

  store.dispatch('core', setChannels(opts.channels));
  logger.setLoggingLevel(fallback(opts.loggingLevel, 'info'));

  message$
    .do(logger.trace)
    .switchMap((message) => Observable.from(SplitMessage(message)))
    .map(parseMessage)
    .do((message: ParsedMessage) => {
      if (message.prefix === null) {
        HandleNoPrefixMessage(message, __event$__);
      } else if (message.prefix === "tmi.twitch.tv") {
        HandleTmiMessage(message, opts.connection, __event$__);
      } else if (message.prefix === "jtv") {
        handleJtvMessages(message, __event$__);
      } else {
        handleOtherMessages(message, __event$__);
      }
    })
    .subscribe((message) => {
      // console.log(message);
    });

  const disconnect = async (): Promise<void> => {
    if (ws !== null && ws.readyState !== 3) {
      store.dispatch('connection', closeConnection(true));
      console.log('Disconnecting From Server');
      ws.close();
    } else {
      console.error(CannotCloseWS);
      throw new Error(CannotCloseWS);
    }
  };

  const reconnect = (timer = store.get('connection').reconnectTimer) => {
    disconnect();
    setTimeout(() => {
      ClientConnect(options, message$, __event$__);
    }, timer);
  };

  __event$__
    .filter(event => event.type === '_RECONNECT_')
    .do(() => reconnect())
    .subscribe();


  // Our exposed API
  return {
    connect: ClientConnect(options, message$, __event$__),

    disconnect: disconnect,

    on: <MessageType extends keyof ClientEventMap>(type: MessageType):
      Observable<ClientEventMap[MessageType] & { type: MessageType; raw: ParsedMessage; }> =>
      __event$__.filter(event => event.type === type),

    __sendCommand: __sendCommand
  };
}

export interface ClientOptions {
  options?: {
    clientId: string;
    debug: boolean;
  };
  connection?: {
    server?: string;
    port?: number;
    reconnect?: boolean;
    maxReconnectAttempts?: number;
    maxReconnectInterval?: number;
    reconnectDecay?: number;
    reconnectInterval?: number;
    secure?: boolean;
    timeout?: number;
  };
  identity?: {
    username?: string;
    password?: string;
  };
  channels: string[];
  loggingLevel?: LoggingLevels;
  logger?: {
    trace?: () => void;
    debug?: () => void;
    info?: () => void;
    warn?: () => void;
    error?: () => void;
    fatal?: () => void;
  };
}
