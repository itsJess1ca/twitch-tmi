export interface UserState {
  badges: {
    [badge: string]: string;
  };
  'badges-raw': string;
  color: string;
  'display-name': string;
  emotes: {
    [emoteSet: string]: string[];
  };
  'emotes-raw': string;
  mod: boolean;
  'room-id': string;
  subscriber: boolean;
  turbo: boolean;
  'user-id': string;
  'user-type': string;
  username: string;
  'message-type': string;
}

export interface ActionEvent {
  channel: string;
  userstate: UserState;
  message: string;
  self: boolean;
}

export interface BanEvent {
  channel: string;
  username: string;
  reason: string | null;
}

export interface ChatEvent {
  channel: string;
  userstate: UserState;
  message: string;
  self: boolean;
}

export interface CheerEvent {
  channel: string;
  userstate: UserState;
  message: string;
}

export interface ClearChatEvent {
  channel: string;
}

export interface ConnectedEvent {
  address: string;
  port: number;
}

export interface ConnectingEvent {
  address: string;
  port: number;
}

export interface DisconnectedEvent {
  reason: string;
}

export interface EmoteOnlyEvent {
  channel: string;
  enabled: boolean;
}

export interface EmoteSetsEvent {
  sets: string;
  obj: any;
}

export interface FollowersOnlyEvent {
  channel: string;
  enabled: boolean;
  length: number;
}

export interface HostedEvent {
  channel: string;
  username: string;
  viewers: number;
  autohost: boolean;
}

export interface HostingEvent {
  channel: string;
  target: string;
  viewers: number;
}

export interface JoinEvent {
  channel: string;
  username: string;
  userstate?: UserState;
  self: boolean;
}

export interface LogonEvent {
}

export interface MessageEvent {
  channel: string;
  userstate: UserState;
  message: string;
  self: boolean;
}

export interface ModEvent {
  channel: string;
  username: string;
}

export interface ModsEvent {
  channel: string;
  mods: string[];
}

export interface NamesEvent {
  channel: string;
  names: string[];
}

export interface NoticeEvent {
  channel: string;
  messageId: KnownMsgIds;
  message: string;
}

export interface PartEvent {
  channel: string;
  username: string;
  self: boolean;
}

export interface PingEvent {}
export interface PongEvent {
  latency: number;
}

export interface R9kbetaEvent {
  channel: string;
  enabled: boolean;
}

export interface ReconnectEvent {}

export interface ResubEvent {
  channel: string;
  username: string;
  months: number;
  message: string;
  userstate: UserState;
  methods: {
    [method: string]: string;
  };
}

export interface RoomstateEvent {
  channel: string;
  state: {
    'broadcaster-lang'?: string | null;
    r9k?: boolean;
    slow?: boolean;
    'subs-only'?: boolean;
    channel: string;
  };
}

export interface ServerChangeEvent {
  channel: string;
}

export interface SlowModeEvent {
  channel: string;
  enabled: boolean;
  length: number;
}

export interface SubscribersEvent {
  channel: string;
  enabled: boolean;
}

export interface SubscriptionEvent {
  channel: string;
  username: string;
  methods: {
    [method: string]: string;
  };
  message: string;
  userstate: UserState;
}

export interface TimeoutEvent {
  channel: string;
  username: string;
  reason: string;
  duration: number;
}

export interface UnhostEvent {
  channel: string;
  viewers: number;
}

export interface UnmodEvent {
  channel: string;
  username: string;
}

export interface WhisperEvent {
  from: string;
  userstate: UserState;
  message: string;
  self: boolean;
}

export interface MessageIdEvent {
  messageId?: string;
}

export interface InternalEvents {
  _DISCONNECT_: {};
  _RECONNECT_: {};
  _promiseConnect: {
    reason?: string;
  };
  _promisePart: {};
  _promiseDisconnect: {
    reason?: string;
  };
  _promisePing: {
    latency: number;
  };
  _promiseSubscribers: MessageIdEvent;
  _promiseSubscribersOff: MessageIdEvent;
  _promiseEmoteonly: MessageIdEvent;
  _promiseEmoteonlyoff: MessageIdEvent;
  _promiseR9kbeta: MessageIdEvent;
  _promiseR9kbetaoff: MessageIdEvent;
  _promiseMods: {
    messageId?: string;
    mods: string[];
  };
  _promiseJoin: MessageIdEvent | {};
  _promiseBan: MessageIdEvent | {};
  _promiseClear: MessageIdEvent;
  _promiseUnmod: MessageIdEvent | {};
  _promiseColor: MessageIdEvent | {};
  _promiseCommercial: MessageIdEvent | {};
  _promiseHost: {
    messageId?: string;
    remainingHosts: number;
  };
  _promiseTimeout: MessageIdEvent;
  _promiseSlow: MessageIdEvent;
  _promiseSlowoff: MessageIdEvent;
  _promiseUnban: MessageIdEvent;
  _promiseUnhost: MessageIdEvent;
  _promiseWhisper: MessageIdEvent;
  _promiseMod: MessageIdEvent;
  _promiseFollowers: MessageIdEvent;
  _promiseFollowersoff: MessageIdEvent;
  _promiseSubscribersoff: MessageIdEvent;

}

export interface ClientEventMap extends InternalEvents {
  "action": ActionEvent;
  "ban": BanEvent;
  "chat": ChatEvent;
  "cheer": CheerEvent;
  "clearchat": ClearChatEvent;
  "connected": ConnectedEvent;
  "connecting": ConnectingEvent;
  "disconnected": DisconnectedEvent;
  "emoteonly": EmoteOnlyEvent;
  "emotesets": EmoteSetsEvent;
  "followersmode": FollowersOnlyEvent;
  "followersonly": FollowersOnlyEvent;
  "hosted": HostedEvent;
  "hosting": HostingEvent;
  "join": JoinEvent;
  "logon": LogonEvent;
  "maxreconnect": {};
  "message": MessageEvent;
  "mod": ModEvent;
  "mods": ModsEvent;
  "names": NamesEvent;
  "notice": NoticeEvent;
  "part": PartEvent;
  "ping": PingEvent;
  "pong": PongEvent;
  "r9kbeta": R9kbetaEvent;
  "r9kmode": R9kbetaEvent;
  "reconnect": ReconnectEvent;
  "resub": ResubEvent;
  "roomstate": RoomstateEvent;
  "serverchange": ServerChangeEvent;
  "slow": SlowModeEvent;
  "slowmode": SlowModeEvent;
  "subscriber": SubscribersEvent;
  "subscribers": SubscribersEvent;
  "subscription": SubscriptionEvent;
  "subanniversary": ResubEvent;
  "timeout": TimeoutEvent;
  "unhost": UnhostEvent;
  "unmod": UnmodEvent;
  "whisper": WhisperEvent;
}

export type ClientEvent = ClientEventMap[keyof ClientEventMap];


export type KnownMsgIds =
  'already_banned' |
  'already_emote_only_on' |
  'already_emote_only_off' |
  'already_subs_on' |
  'already_subs_off' |
  'bad_ban_admin' |
  'bad_ban_broadcaster' |
  'bad_ban_global_mod' |
  'bad_ban_self' |
  'bad_ban_staff' |
  'bad_commercial_error' |
  'bad_host_hosting' |
  'bad_host_rate_exceeded' |
  'bad_mod_mod' |
  'bad_mod_banned' |
  'bad_timeout_admin' |
  'bad_timeout_global_mod' |
  'bad_timeout_self' |
  'bad_timeout_staff' |
  'bad_unban_no_ban' |
  'bad_unmod_mod' |
  'ban_success' |
  'cmds_available' |
  'color_changed' |
  'commercial_success' |
  'emote_only_on' |
  'emote_only_off' |
  'host_off' |
  'host_on' |
  'hosts_remaining' |
  'host_target_went_offline' |
  'mod_success' |
  'msg_banned' |
  'msg_censored_broadcaster' |
  'msg_channel_suspended' |
  'msg_duplicate' |
  'msg_emoteonly' |
  'msg_ratelimit' |
  'msg_subsonly' |
  'msg_timedout' |
  'msg_verified_email' |
  'no_help' |
  'no_mods' |
  'no_permission' |
  'not_hosting' |
  'r9k_off' |
  'r9k_on' |
  'room_mods' |
  'slow_off' |
  'slow_on' |
  'subs_off' |
  'subs_on' |
  'timeout_success' |
  'unban_success' |
  'unmod_success' |
  'unrecognized_cmd' |
  'usage_ban' |
  'usage_clear' |
  'usage_color' |
  'usage_commercial' |
  'usage_disconnect' |
  'usage_emote_only_on' |
  'usage_emote_only_off' |
  'usage_help' |
  'usage_host' |
  'usage_me' |
  'usage_mod' |
  'usage_mods' |
  'usage_r9k_on' |
  'usage_r9k_off' |
  'usage_slow_on' |
  'usage_slow_off' |
  'usage_subs_on' |
  'usage_subs_off' |
  'usage_timeout' |
  'usage_unban' |
  'usage_unhost' |
  'usage_unmod' |
  'whisper_invalid_self' |
  'whisper_limit_per_min' |
  'whisper_limit_per_sec' |
  'whisper_restricted_recipient';
