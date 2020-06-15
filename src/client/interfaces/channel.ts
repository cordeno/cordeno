import { Overwrite } from "./permission.ts";
import { User } from "./user.ts";

// https://discord.com/developers/docs/resources/channel#channel-mention-object
export interface Channel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: Array<Overwrite>;
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: Array<User>;
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: string;
}

export interface ChannelMention {
  id: string;
  guild_id: string;
  type: number;
  name: string;
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
