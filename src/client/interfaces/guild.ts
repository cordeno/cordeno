import { Role } from "./role.ts";
import { Emoji } from "./reaction.ts";
import { Voice } from "./voice.ts";
import { GuildMember, Presence } from "./user.ts";
import { Channel } from "./channel.ts";

// https://discord.com/developers/docs/resources/guild#guild-object
export interface Guild {
  id: string;
  name: string;
  icon: string;
  splash: string;
  discovery_splash: string;
  owner?: boolean;
  owner_id: string;
  permissions?: number;
  region: string;
  afk_channel_id: string;
  afk_timeout: number;
  embed_enabled?: boolean;
  embed_channel_id?: string;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: Array<Role>;
  emojis: Array<Emoji>;
  features: Array<string>;
  mfa_level: number;
  application_id: string;
  widget_enabled?: boolean;
  widget_channel_id?: string;
  system_channel_id: string;
  system_channel_flags: number;
  rules_channel_id: string;
  joined_at?: string;
  large?: boolean;
  unavailable?: boolean;
  member_count?: number;
  voice_states?: Array<Voice>;
  members?: Array<GuildMember>;
  channels?: Array<Channel>;
  presences?: Array<Presence>;
  max_presences?: number;
  max_members?: number;
  vanity_url_code: string;
  description: string;
  banner: string;
  premium_tier: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id: string;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

// https://discord.com/developers/docs/resources/guild#unavailable-guild-object
export interface GuildPreview {
  id: string;
  name: string;
  icon: string;
  splash: string;
  discovery_splash: string;
  emojis: Array<Emoji>;
  features: Array<string>;
  approximate_member_count: number;
  approximate_presence_count: number;
  description: string;
}
