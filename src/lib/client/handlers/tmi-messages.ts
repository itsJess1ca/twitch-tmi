import { ParsedMessage } from '../../parser/message';
import { noop } from '../../../utils/noop';
import { fallback } from '../../../utils/fallback';
import { __event$__, ClientOptions, store } from '../client';
import {
  setEmoteSets, setLastJoinedChannel, setPingLoop, setPingTimeout,
  setUsername
} from '../../state/core/core.actions';
import { Timer } from '../../timer.class';
import { formatChannelName } from '../../../utils/channel';
import { closeConnection, setShouldReconnect } from '../../state/connection/connection.actions';
import { Subject } from 'rxjs/Subject';
import { ClientEventMap, InternalEvents, KnownMsgIds, RoomstateEvent, UserState } from '../event-types';
import { logger } from '../../logger';
import { buildEvent } from '../../../utils/build-event';
import { replaceAll } from '../../../utils/replace-all';
import { __ws__ } from '../client.connect';
import {
  addChannel, addModerator, clearChannels, clearModerators,
  setUserState
} from '../../state/channel/channel.actions';
import { isJustinfan } from '../../../utils/type-checks';
import { getEmoteSets } from '../../twitch-api/get-emote-sets';

export function HandleTmiMessage(message: ParsedMessage, event$: Subject<any>): void {
  const opts = () => store.get('core').options;
  const commands = {
    "002": noop,
    "003": noop,
    "004": noop,
    "375": noop,
    "376": noop,
    "CAP": noop,

    // Retrieve username from server..
    "001": () => store.dispatch('core', setUsername(message.params[0])),

    "372": () => {
      logger.info('connected to server');
      event$.next(buildEvent('connected', {
        port: opts().connection.port,
        address: opts().connection.server
      }, message.raw));
      event$.next(buildEvent('_promiseConnect', {}, message.raw));
      const pingLoop = setInterval(() => {
        // Make sure the connection is opened before sending the message..
        if (__ws__ !== null && __ws__.readyState !== 2 && __ws__.readyState !== 3) {
          __ws__.send("PING");
        }
        const latency = new Date();
        const pingTimeout = setTimeout(() => {
          if (__ws__ !== null) {
            store.dispatch('connection', closeConnection(false));
            logger.error("Ping timeout.");
            __ws__.close();

            clearInterval(pingLoop);
            clearTimeout(pingTimeout);
          }
        }, fallback(opts().connection.timeout, 9999));
        store.dispatch('core', setPingTimeout(pingTimeout));
      }, 60000);
      store.dispatch('core', setPingLoop(pingLoop));
      store.dispatch('channel', clearChannels());

      const joinQueue = new Timer(2000);
      // logger.info(channels);
      for (const channel of opts().channels) {
        joinQueue.add(function (channel) {
          if (__ws__ !== null && __ws__.readyState !== 2 && __ws__.readyState !== 3) {
            __ws__.send(`JOIN ${formatChannelName(channel)}`);
          }
        }.bind(this, channel));
      }
      joinQueue.run();
    },

    "NOTICE": () => {
      const generalNotice = (internalPromise: keyof ClientEventMap | [keyof ClientEventMap], msgId: boolean = false) => {
        logger.info(`[${message.channel}] ${message.content}`);
        if (Array.isArray(internalPromise)) {
          for (const p of internalPromise) {
            __event$__.next(buildEvent(p, {messageId: msgId ? message.messageId : undefined}, message.raw));
          }
        } else {
          __event$__.next(buildEvent(internalPromise, {messageId: msgId ? message.messageId : undefined}, message.raw));
        }
        __event$__.next(buildEvent('notice', {
          channel: message.channel,
          messageId: message.messageId as KnownMsgIds,
          message: message.content
        }, message.raw));
      };
      const banCommandFailed = () => {
        logger.info(`[${message.channel}] ${message.content}`);
        __event$__.next(buildEvent('_promiseBan', {messageId: message.messageId}, message.raw));
        __event$__.next(buildEvent('notice', {
          channel: message.channel,
          messageId: message.messageId as KnownMsgIds,
          message: message.content
        }, message.raw));
      };
      const modCommandFailed = () => {
        {
          logger.info(`[${message.channel}] ${message.content}`);
          __event$__.next(buildEvent('_promiseMod', {messageId: message.messageId}, message.raw));
          __event$__.next(buildEvent('notice', {
            channel: message.channel,
            messageId: message.messageId as KnownMsgIds,
            message: message.content
          }, message.raw));
        }
      };
      const hostCommandFailed = () => {
        logger.info(`[${message.channel}] ${message.content}`);
        __event$__.next(buildEvent('_promiseHost', {messageId: message.messageId, remainingHosts: null}, message.raw));
        __event$__.next(buildEvent('notice', {
          channel: message.channel,
          messageId: message.messageId as KnownMsgIds,
          message: message.content
        }, message.raw));
      };
      const messageIds = {
        "subs_on": () => {
          logger.info(`[${message.channel}] This room is now in subscribers-only mode.`);
          __event$__.next(buildEvent('subscriber', {
            channel: message.channel,
            enabled: true
          }, message.raw));
          __event$__.next(buildEvent('subscribers', {
            channel: message.channel,
            enabled: true
          }, message.raw));
          __event$__.next(buildEvent('_promiseSubscribers', {}, message.raw));
        },
        "subs_off": () => {
          logger.info(`[${message.channel}] This room is no longer in subscribers-only mode.`);
          __event$__.next(buildEvent('subscriber', {
            channel: message.channel,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('subscribers', {
            channel: message.channel,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('_promiseSubscribersoff', {}, message.raw));
        },
        "emote_only_on": () => {
          logger.info(`[${message.channel}] This room is now in emote-only mode.`);
          __event$__.next(buildEvent('emoteonly', {
            channel: message.channel,
            enabled: true
          }, message.raw));
          __event$__.next(buildEvent('_promiseEmoteonly', {}, message.raw));
        },
        "emote_only_off": () => {
          logger.info(`[${message.channel}] This room is no longer in emote-only mode.`);
          __event$__.next(buildEvent('emoteonly', {
            channel: message.channel,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('_promiseEmoteonlyoff', {}, message.raw));
        },
        "r9k_on": () => {
          logger.info(`[${message.channel}] This room is now in r9k mode.`);
          __event$__.next(buildEvent('r9kbeta', {
            channel: message.channel,
            enabled: true
          }, message.raw));
          __event$__.next(buildEvent('r9kmode', {
            channel: message.channel,
            enabled: true
          }, message.raw));
          __event$__.next(buildEvent('_promiseR9kbeta', {}, message.raw));
        },
        "r9k_off": () => {
          logger.info(`[${message.channel}] This room is now in r9k mode.`);
          __event$__.next(buildEvent('r9kbeta', {
            channel: message.channel,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('r9kmode', {
            channel: message.channel,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('_promiseR9kbetaoff', {}, message.raw));
        },
        "room_mods": () => {
          const msgSplit = message.content.split(':');
          const mods = msgSplit[1].replace(/,/g, '').split(':').toString().toLowerCase().split(' ');
          for (let i = mods.length - 1; i >= 0; i--) {
            if (mods[i] === "") {
              mods.splice(i, 1);
            }
          }

          __event$__.next(buildEvent('_promiseMods', {mods}, message.raw));
          __event$__.next(buildEvent('mods', {channel: message.channel, mods}, message.raw));
        },
        "no_mods": () => {
          __event$__.next(buildEvent('_promiseMods', {mods: []}, message.raw));
        },
        "msg_channel_suspended": generalNotice('_promiseJoin', true),
        "already_banned": banCommandFailed,
        "bad_ban_admin": banCommandFailed,
        "bad_ban_broadcaster": banCommandFailed,
        "bad_ban_global_mod": banCommandFailed,
        "bad_ban_self": banCommandFailed,
        "bad_ban_staff": banCommandFailed,
        "usage_ban": banCommandFailed,
        "ban_success:": generalNotice('_promiseBan', false),
        "usage_clear": generalNotice('_promiseClear', true),
        "usage_mods": () => {
          logger.info(`[${message.channel}] ${message.content}`);
          __event$__.next(buildEvent('_promiseMods', {messageId: message.messageId, mods: []}, message.raw));
          __event$__.next(buildEvent('notice', {
            channel: message.channel,
            messageId: message.messageId as KnownMsgIds,
            message: message.content
          }, message.raw));
        },
        "mod_success": generalNotice('_promiseMod', true),
        "usage_mod": modCommandFailed,
        "bad_mod_banned": modCommandFailed,
        "bad_mod_mod": modCommandFailed,
        "unmod_success": generalNotice('_promiseUnmod', false),
        "usage_unmod": generalNotice('_promiseUnmod', true),
        "bad_unmod_mod": generalNotice('_promiseUnmod', true),
        "color_changed": generalNotice('_promiseColor', false),
        "usage_color": generalNotice('_promiseColor', true),
        "turbo_only_color": generalNotice('_promiseColor', true),
        "commercial_success": generalNotice('_promiseCommercial', true),
        "usage_commercial": generalNotice('_promiseCommercial', true),
        "bad_commercial_error": generalNotice('_promiseCommercial', true),
        "hosts_remaining": () => {
          logger.info(`[${message.channel}] ${message.content}`);
          const remaningHosts = message.content.charAt(0);
          __event$__.next(buildEvent('_promiseHost', {
            messageId: message.messageId,
            remainingHosts: ~~remaningHosts
          }, message.raw));
          __event$__.next(buildEvent('notice', {
            channel: message.channel,
            messageId: message.messageId as KnownMsgIds,
            message: message.content
          }, message.raw));
        },
        "bad_host_hosting": hostCommandFailed,
        "bad_host_rate_exceeded": hostCommandFailed,
        "bad_host_error": hostCommandFailed,
        "usage_host": hostCommandFailed,
        "already_r9k_on": generalNotice('_promiseR9kbeta', true),
        "usage_r9k_on": generalNotice('_promiseR9kbeta', true),
        "already_r9k_off": generalNotice('_promiseR9kbetaoff', true),
        "usage_r9k_off": generalNotice('_promiseR9kbetaoff', true),
        "timeout_success": generalNotice('_promiseTimeout', false),
        "already_subs_off": generalNotice('_promiseSubscribersoff', true),
        "usage_subs_off": generalNotice('_promiseSubscribersoff', true),
        "already_subs_on": generalNotice('_promiseSubscribers', true),
        "usage_subs_on": generalNotice('_promiseSubscribers', true),
        "already_emote_only_off": generalNotice('_promiseEmoteonlyoff', true),
        "usage_emote_only_off": generalNotice('_promiseEmoteonlyoff', true),
        "already_emote_only_on": generalNotice('_promiseEmoteonly', true),
        "usage_emote_only_on": generalNotice('_promiseEmoteonly', true),
        "usage_slow_on": generalNotice('_promiseSlow', true),
        "usage_slow_off": generalNotice('_promiseSlowoff', true),
        "usage_timeout": generalNotice('_promiseTimeout', true),
        "bad_timeout_admin": generalNotice('_promiseTimeout', true),
        "bad_timeout_broadcaster": generalNotice('_promiseTimeout', true),
        "bad_timeout_duration": generalNotice('_promiseTimeout', true),
        "bad_timeout_global_mod": generalNotice('_promiseTimeout', true),
        "bad_timeout_self": generalNotice('_promiseTimeout', true),
        "bad_timeout_staff": generalNotice('_promiseTimeout', true),
        "unban_success": generalNotice('_promiseUnban', false),
        "usage_unban": generalNotice('_promiseUnban', true),
        "bad_unban_no_ban": generalNotice('_promiseUnban', true),
        "usage_unhost": generalNotice('_promiseUnhost', true),
        "not_hosting": generalNotice('_promiseUnhost', true),
        "whisper_invalid_login": generalNotice('_promiseWhisper', true),
        "whisper_invalid_self": generalNotice('_promiseWhisper', true),
        "whisper_limit_per_min": generalNotice('_promiseWhisper', true),
        "whisper_limit_per_sec": generalNotice('_promiseWhisper', true),
        "whisper_restricted_recipient": generalNotice('_promiseWhisper', true),
        "no_permission": generalNotice([
          '_promiseBan',
          '_promiseClear',
          '_promiseUnban',
          '_promiseTimeout',
          '_promiseMods',
          '_promiseMod',
          '_promiseUnmod',
          '_promiseCommercial',
          '_promiseHost',
          '_promiseUnhost',
          '_promiseR9kbeta',
          '_promiseR9kbetaoff',
          '_promiseSlow',
          '_promiseSlowoff',
          '_promiseFollowers',
          '_promiseFollowersoff',
          '_promiseSubscribers',
          '_promiseSubscribersoff',
          '_promiseEmoteonly',
          '_promiseEmoteonlyoff',
        ], true),
        "msg_banned": generalNotice([
          '_promiseBan',
          '_promiseClear',
          '_promiseUnban',
          '_promiseTimeout',
          '_promiseMods',
          '_promiseMod',
          '_promiseUnmod',
          '_promiseCommercial',
          '_promiseHost',
          '_promiseUnhost',
          '_promiseR9kbeta',
          '_promiseR9kbetaoff',
          '_promiseSlow',
          '_promiseSlowoff',
          '_promiseFollowers',
          '_promiseFollowersoff',
          '_promiseSubscribers',
          '_promiseSubscribersoff',
          '_promiseEmoteonly',
          '_promiseEmoteonlyoff',
        ], true),
        "unrecognized_cmd": () => {
          logger.info(`[${message.channel}] ${message.content}`);
          __event$__.next(buildEvent('notice', {
            channel: message.channel,
            messageId: message.messageId as KnownMsgIds,
            message: message.content
          }, message.raw));

          if (message.content.split(" ").splice(-1)[0] === '/w') {
            logger.warn(`You must be connected to a group server to send or receive whispers`);
          }
        },
        "cmds_available": generalNotice([] as [keyof ClientEventMap]),
        "host_target_went_offline": generalNotice([] as [keyof ClientEventMap]),
        "msg_censored_broadcaster": generalNotice([] as [keyof ClientEventMap]),
        "msg_duplicate": generalNotice([] as [keyof ClientEventMap]),
        "msg_emoteonly": generalNotice([] as [keyof ClientEventMap]),
        "msg_verified_email": generalNotice([] as [keyof ClientEventMap]),
        "msg_ratelimit": generalNotice([] as [keyof ClientEventMap]),
        "msg_subsonly": generalNotice([] as [keyof ClientEventMap]),
        "msg_timedout": generalNotice([] as [keyof ClientEventMap]),
        "no_help": generalNotice([] as [keyof ClientEventMap]),
        "usage_disconnect": generalNotice([] as [keyof ClientEventMap]),
        "usage_help": generalNotice([] as [keyof ClientEventMap]),
        "usage_me": generalNotice([] as [keyof ClientEventMap])
      };
      messageIds[message.messageId] ? messageIds[message.messageId]() : () => {
        if (
          message.content.includes('Login unsuccessful') ||
          message.content.includes("Login authentication failed") ||
          message.content.includes('Error logging in') ||
          message.content.includes('Improperly formatted auth')
        ) {
          // Handle login failure
          store.dispatch('connection', closeConnection(false));
          store.dispatch('connection', setShouldReconnect(false));
          logger.error(message.content);
          __ws__.close();

        } else if (message.content.includes("Invalid NICK")) {
          // Handle invalid NICK
          store.dispatch('connection', closeConnection(false));
          store.dispatch('connection', setShouldReconnect(false));
          logger.error("Invalid NICK");
          __ws__.close();
        } else {
          logger.warn(`Could not parse NOTICE message from tmi.twitch.tv:
            ${JSON.stringify(message, null, 2)}
          `);
        }
      };
    },

    "USERNOTICE": () => {
      if (message.messageId === 'resub') {
        const username = message.tags['display-name'] || message.tags['login'];
        const plan = message.tags['msg-param-sub-plan'];
        const planName = replaceAll(fallback(message.tags['msg-param-sub-plan-name'], null), {
          "\\\\s": " ",
          "\\\\:": ";",
          "\\\\\\\\": "\\",
          "\\r": "\r",
          "\\n": "\n"
        });
        const months = fallback(~~message.tags['msg-param-months'], null);
        const prime = plan.includes('Prime');
        let userstate = {};

        if (message.content) {
          userstate = message.tags;
          userstate['message-type'] = 'resub';
        }

        const eventBody = {
          channel: message.channel,
          username: username,
          months,
          message: message.content,
          userstate: userstate as UserState,
          methods: {
            prime,
            plan,
            planName
          }
        };
        __event$__.next(buildEvent('resub', eventBody, message.raw));
        __event$__.next(buildEvent('subanniversary', eventBody, message.raw));
      } else if (message.messageId === 'sub') {

        const username = message.tags['display-name'] || message.tags['login'];
        const plan = message.tags['msg-param-sub-plan'];
        const planName = replaceAll(fallback(message.tags['msg-param-sub-plan-name'], null), {
          "\\\\s": " ",
          "\\\\:": ";",
          "\\\\\\\\": "\\",
          "\\r": "\r",
          "\\n": "\n"
        });
        const prime = plan.includes('Prime');
        let userstate = {};

        if (message.content) {
          userstate = message.tags;
          userstate['message-type'] = 'sub';
        }

        const eventBody = {
          channel: message.channel,
          username: username,
          message: message.content,
          userstate: userstate as UserState,
          methods: {
            prime,
            plan,
            planName
          }
        };
        __event$__.next(buildEvent('subscription', eventBody, message.raw));
      }
    },

    "HOSTTARGET": () => {
      const msgSplit = message.content.split(" ")[0];
      const viewers = ~~msgSplit[1] || 0;
      if (msgSplit[0] === '-') {
        // Left host mode
        logger.info(`[${message.channel}] Exited host mode`);
        __event$__.next(buildEvent('unhost', {
          channel: message.channel,
          viewers: viewers
        }, message.raw));
      } else {
        // Entered host mode

        logger.info(`[${message.channel}] Now hosting ${msgSplit[0]} for ${viewers} viewer(s).`);
        __event$__.next(buildEvent('hosting', {
          channel: message.channel,
          viewers: viewers,
          target: msgSplit[0]
        }, message.raw));
      }
    },

    "CLEARCHAT": () => {
      if (message.params.length > 1) {
        // User has been banned or timed out by a mod
        const duration = fallback(message.tags['ban-duration'], null);
        const reason = replaceAll(fallback(message.tags['ban-duration'], null), {
          "\\\\s": " ",
          "\\\\:": ";",
          "\\\\\\\\": "\\",
          "\\r": "\r",
          "\\n": "\n"
        });

        if (duration === null) {
          logger.info(`[${message.channel}] ${message.content} has been banned. Reason: ${reason || "n/a"}`);
          __event$__.next(buildEvent('ban', {
            channel: message.channel,
            username: message.content,
            reason
          }, message.raw));
        } else {
          logger.info(`[${message.channel}] ${message.content} has been timed out for ${duration} seconds. Reason: ${reason || "n/a"}`);
          __event$__.next(buildEvent('timeout', {
            channel: message.channel,
            username: message.content,
            reason,
            duration: ~~duration
          }, message.raw));
        }
      } else {
        // Chat was cleared by a moderator
        logger.info(`[${message.channel}] Chat was cleared by a moderator.`);
        __event$__.next(buildEvent('clearchat', {channel: message.channel}, message.raw));
        __event$__.next(buildEvent('_promiseClear', {}, message.raw));
      }
    },

    "RECONNECT": () => {
      logger.info(`Received RECONNECT request from Twitch..`);
      logger.info(`Disconnecting and reconnecting in ${Math.round(store.get('connection').reconnectTimer / 1000)} seconds..`);
      __event$__.next(buildEvent('_RECONNECT_', {}, message.raw));
    },

    "USERSTATE": () => {
      message.tags['username'] = opts().identity.username;

      if (message.tags['user-type'] === 'mod') {
        const lastJoinedChannel = store.get('core').lastJoinedChannel;
        if (!store.get('channel')[lastJoinedChannel]) { store.dispatch('channel', clearModerators(lastJoinedChannel)); }
        if (store.get('channel')[lastJoinedChannel].moderators.indexOf(opts().identity.username) < 0) {
          store.dispatch('channel', addModerator(lastJoinedChannel, opts().identity.username));
        }
      }

      if (!isJustinfan(opts().identity.username) && !store.get('channel')[message.channel].userstate) {
        store.dispatch('channel', setUserState(message.channel, message.tags));
        store.dispatch('core', setLastJoinedChannel(message.channel));
        store.dispatch('channel', addChannel(message.channel));
        logger.info(`Joined ${message.channel}`);
        __ws__.next(buildEvent('join', {
          username: opts().identity.username,
          channel: message.channel,
          self: true
        }, message.raw));
      }

      if (message.tags["emote-sets"] !== store.get('core').emoteSets) {
        getEmoteSets(message.tags['emote-sets'])
          .do(response => store.dispatch('core', setEmoteSets(response.emoticon_sets)))
          .subscribe();
      }
    },

    "GLOBALUSERSTATE": () => {
      store.dispatch('channel', setUserState('__global__', message.tags));

      if (typeof message.tags['emote-sets'] !== 'undefined') {
        getEmoteSets(message.tags['emote-sets'])
          .do(response => store.dispatch('core', setEmoteSets(response.emoticon_sets)))
          .subscribe();
      }
    },

    "ROOMSTATE": () => {
      // Received when joining a channel and every time one of the chat room settings (ie: slow mode, subonly, etc) changes.
      // The message on join contains all room settings

      // Emit that we successfully joined the room
      if (formatChannelName(store.get('core').lastJoinedChannel) === formatChannelName(message.params[0])) {
        __event$__.next(buildEvent('_promiseJoin', {}, message.raw));
      }

      message.tags['channel'] = formatChannelName(message.params[0]);
      __event$__.next(buildEvent('roomstate', {state: message.tags, channel: message.params[0]} as RoomstateEvent, message.raw));

      if (message.tags.hasOwnProperty('slow') && !message.tags.hasOwnProperty('subs-only')) {
        if (typeof message.tags['slow'] === 'boolean') {
          logger.info(`[${message.channel}] This room is no longer in slow mode`);
          __event$__.next(buildEvent('slow', {
            enabled: false,
            length: 0,
            channel: message.channel
          }, message.raw));
          __event$__.next(buildEvent('slowmode', {
            enabled: false,
            length: 0,
            channel: message.channel
          }, message.raw));
          __event$__.next(buildEvent('_promiseSlowoff', {}, message.raw));
        } else {
          logger.info(`[${message.channel}] This room is now in slow mode.`);
          const length = ~~message.tags['slow'];
          __event$__.next(buildEvent('slow', {
            enabled: true,
            length: length,
            channel: message.channel
          }, message.raw));
          __event$__.next(buildEvent('slowmode', {
            enabled: true,
            length: length,
            channel: message.channel
          }, message.raw));
          __event$__.next(buildEvent('_promiseSlowoff', {}, message.raw));
        }
      }

      if (message.tags.hasOwnProperty('followers-only') && !message.tags.hasOwnProperty('subs-only')) {
        if (message.tags['followers-only'] === '-1') {
          logger.info(`[${message.channel}] This room is no longer in followers-only mode`);
          __event$__.next(buildEvent('followersonly', {
            channel: message.channel,
            length: 0,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('followersmode', {
            channel: message.channel,
            length: 0,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('_promiseFollowersoff', {}, message.raw));
        } else {
          const minutes = ~~message.tags['followers-only'];
          __event$__.next(buildEvent('followersonly', {
            channel: message.channel,
            length: minutes,
            enabled: true
          }, message.raw));
          __event$__.next(buildEvent('followersmode', {
            channel: message.channel,
            length: minutes,
            enabled: false
          }, message.raw));
          __event$__.next(buildEvent('_promiseFollowersoff', {}, message.raw));
        }
      }
    }
  };
  commands[message.command] ? commands[message.command]() : (() => {
    logger.info(`Could not parse message from tmi.twitch.tv: 
       ${JSON.stringify(message, null, 2)}
      `);
  })();
}
