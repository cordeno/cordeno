// https://discord.com/developers/docs/resources/channel#message-object
export interface Message {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: User;
  member?: GuildMember;
  content: string;
  timestamp: string;
  edited_timestamp: string;
  tts: boolean;
  mention_everyone: boolean;
  mentions: Array<User & GuildMember>;
  mention_roles: Array<Role>;
  mention_channels?: Array<ChannelMention>;
  attachments: Array<Attachment>;
  embeds: Array<Embed>;
  reactions?: Array<Reaction>;
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: string;
  type: number;
  activity?: Activity;
  application?: Application;
  message_reference?: MessageReference;
  flags?: number;
}

//https://discord.com/developers/docs/resources/guild#guild-member-object
export interface GuildMember {
  user: User;
  nick: string;
  roles: Array<string>;
  joined_at: string;
  premium_since?: string;
  deaf: boolean;
  mute: boolean;
}

// https://discord.com/developers/docs/resources/user#user-object
export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

// https://discord.com/developers/docs/topics/permissions#role-object
export interface Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: number;
  managed: boolean;
  mentionable: boolean;
}

// https://discord.com/developers/docs/resources/channel#channel-mention-object
export interface ChannelMention {
  id: string;
  guild_id: string;
  type: number;
  name: string;
}

// https://discord.com/developers/docs/resources/channel#attachment-object
export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  height: number;
  width: number;
}

// https://discord.com/developers/docs/resources/channel#embed-object
export interface Embed {
  title: string;
  type: string;
  description: string;
  url: string;
  timestamp: string;
  color: number;
  footer: {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  image?: {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  thumbnail?: {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  video?: {
    url?: string;
    height?: number;
    width?: number;
  };
  provider?: {
    name?: string;
    url?: string;
  };
  author?: {
    name?: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
}

// https://discord.com/developers/docs/resources/channel#reaction-object
export interface Reaction {
  count: number;
  me: boolean;
  emoji: Emoji;
}

// https://discord.com/developers/docs/resources/emoji#emoji-object
export interface Emoji {
  id: string;
  name: string;
  roles?: Array<Role>;
  user?: User;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure
export interface Activity {
  type: number;
  party_id?: string;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-application-structure
export interface Application {
  id: string;
  cover_image?: string;
  description: string;
  icon: string;
  name: string;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-reference-structure
export interface MessageReference {
  message_id?: string;
  channel_id: string;
  guild_id?: string;
}
