import { parseEmotes } from '../parser/emotes';
import { parseBadges } from '../parser/badges';
import { ParsedMessage, parseMessage } from '../parser/message';
import { fallback } from '../../utils/fallback';
import { formatChannelName } from '../../utils/channel';
import { __ws__ } from './client.connect';
import { noop } from '../../utils/noop';
import { Timer } from '../timer.class';
import { isJustinfan } from '../../utils/type-checks';

let username;

export function ClientOnMessage(message: string): void {
  const messages = SplitMessage(message);


  for (const message of messages) {
    ClientHandleMessage(parseMessage(message));
  }
}

export function SplitMessage(message: string): string[] {
  return message.split('\r\n').filter(message => !!message);
}

export function ClientHandleMessage(message: ParsedMessage) {
  const chan = formatChannelName(fallback(message.params[0], null));
  const msg = fallback(message.params[1], null);
  const msgId = fallback(message.tags['msg-id'], null);

  message.tags = parseBadges(parseEmotes(message.tags));

  // Transform IRCv3 tags
  if (message.tags) {
    for (const tag in message.tags) {
      if (message.tags.hasOwnProperty(tag)) {
        if (tag !== "emote-sets" && tag !== "ban-duration" && tag !== "bits") {
          if (typeof message.tags[tag] === "boolean") {
            message.tags[tag] = null;
          } else if (message.tags[tag] === "1" ) {
            message.tags[tag] = true;
          } else if (message.tags[tag] === "0" ) {
            message.tags[tag] = false;
          }
        }
      }
    }
  }

  // Message with no prefix
  if (message.prefix === null) {
    const commands = {
      "PING": () => {
        if (__ws__ !== null && __ws__.readyState !== 2 && __ws__.readyState !== 3) {
          __ws__.send("PONG");
        }
      },
      "PONG": () => {
        console.log('pong');
      }
    };
    commands[message.command] ? commands[message.command]() : (() => {
      console.log(`Could not parse message with no prefix: 
       ${JSON.stringify(message, null, 2)}
      `);
    })();
  } else if (message.prefix === "tmi.twitch.tv") {
    const commands = {
      "002": noop,
      "003": noop,
      "004": noop,
      "375": noop,
      "376": noop,
      "CAP": noop,

      // Retrieve username from server..
      "001": () => {
        console.log('username: ', message.params[0]);
        username = message.params[0];
      },

      "372": () => {
        console.log('connected to server');
        const pingLoop = setInterval(() => {
          // Make sure the connection is opened before sending the message..
          if (__ws__ !== null && __ws__.readyState !== 2 && __ws__.readyState !== 3) {
            __ws__.send("PING");
          }
          const latency = new Date();
          const pingTimeout = setTimeout(() => {
            if (__ws__ !== null) {
              const wasCloseCalled = false;
              console.error("Ping timeout.");
              __ws__.close();

              clearInterval(pingLoop);
              clearTimeout(pingTimeout);
            }
          }, fallback(this.opts.connection.timeout, 9999));
        }, 60000);

        /*const joinQueue = new Timer(2000);
        // console.log(channels);
        for (const channel of channels) {
          joinQueue.add(function (channel) {
            if (ws !== null && ws.readyState !== 2 && ws.readyState !== 3) {
              console.log(channel);
              ws.send(`JOIN ${formatChannelName(channel)}`);
            }
          }.bind(this, channel));
        }
        joinQueue.run();*/
      },

      "NOTICE": () => {
        const messageIds = {
          "subs_on": () => {},
          "subs_off": () => {},
          "emote_only_on": () => {},
          "emote_only_off": () => {},
          "r9k_on": () => {},
          "r9k_off": () => {},
          "room_mods": () => {},
          "no_mods": () => {},
          "msg_channel_suspended": () => {},
          "already_banned": () => {},
          "bad_ban_admin": () => {},
          "bad_ban_broadcaster": () => {},
          "bad_ban_global_mod": () => {},
          "bad_ban_self": () => {},
          "bad_ban_staff": () => {},
          "usage_ban": () => {},

          "ban_success:": () => {},

          "usage_clear": () => {},

          "usage_mods": () => {},


        };
        messageIds[msgId] ? messageIds[msgId]() : noop();
      }
    };
    commands[message.command] ? commands[message.command]() : (() => {
      console.log(`Could not parse message from tmi.twitch.tv: 
       ${JSON.stringify(message, null, 2)}
      `);
    })();
  } else if (message.prefix === "jtv") {
    const commands = {
      "MODE": () => {
        if (msg === "+o") {
          // Add username to the moderators...
        } else if (msg === "-o") {
          // Remove username from the moderators...
        }
      }
    };
    commands[message.command] ? commands[message.command]() : (() => {
      console.log(`Could not parse message from jtv: 
       ${JSON.stringify(message, null, 2)}
      `);
    })();
  } else {
    const commands = {
      "353" : () => {
        console.log(message.params[2], message.params[3].split(" "));
      },
      "JOIN": () => {
        if (isJustinfan(username) && username === message.prefix.split("!")[0]) {
          // Joined the channel as a justinfan user
          
          console.log(`Joined ${chan}`);
        }

        if (username !== message.prefix.split("!")[0]) {
          // Someone else joined the channel, just emit the join event..

          console.log(`${message.prefix.split("!")[0]} Joined ${chan}`);
        }
      },
      "PRIVMSG": () => {
        // Add username (lowercase) to the tags..
        message.tags['username'] = message.prefix.split("!")[0];

        if (message.tags['username'] === "jtv") {
          // Message from JTV..

          if (msg.includes("hosting you for")) {
            // Someone is hosting the channel and the message contains how many viewers..


          } else if (msg.includes("hosting you")) {
            // Some is hosting the channel, but no viewer(s) count provided in the message..

          }
        } else {
          // Message is an action (/me <message>)..

          if (msg.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)) {
            message.tags["message-type"] = "action";

            /*this.emits(["action", "message"], [
              [chan, message.tags, msg.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1], false],
              [chan, message.tags, msg.match(/^\u0001ACTION ([^\u0001]+)\u0001$/)[1], false]
            ]);*/
          } else {
            if (message.tags.hasOwnProperty("bits")) {
              // Message is a cheer

            } else {
              // Message is a regular chat message..

              message.tags["message-type"] = "chat";
              console.log(`[${chan}] <${message.tags['username']}>: ${msg}`);
            }
          }
        }
      }
    };
    commands[message.command] ? commands[message.command]() : noop();
  }
}
