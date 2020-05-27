import { User, GuildMember } from "./user.ts";
import { Reaction } from "./reaction.ts";
import { Role } from "./role.ts";
import { ChannelMention, Activity, Application } from "./channel.ts";

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

// https://discord.com/developers/docs/resources/channel#message-object-message-reference-structure
export interface MessageReference {
  message_id?: string;
  channel_id: string;
  guild_id?: string;
}
