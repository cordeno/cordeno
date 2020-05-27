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

// https://discord.com/developers/docs/topics/gateway#presence-update
export interface Presence {
  user: User;
  roles: Array<string>;
  game: UserActivity | null;
  guild_id: string;
  status: string;
  activities: Array<UserActivity>;
  client_status: ClientStatus;
  premium_since?: string;
  nick?: string;
}

// https://discord.com/developers/docs/topics/gateway#activity-object
export interface UserActivity {
  name: string;
  type: number;
  url?: string;
  created_at: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id?: string;
  details?: string;
  state?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  party?: {
    id?: string;
    size?: [number, number];
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: number;
}

// https://discord.com/developers/docs/topics/gateway#client-status-object
export interface ClientStatus {
  desktop?: string;
  mobile?: string;
  web?: string;
}
