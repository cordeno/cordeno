import { User } from "./user.ts";
import { Guild } from "./guild.ts";

// https://discord.com/developers/docs/topics/gateway#ready
export interface Ready {
  v: number;
  user: User;
  private_channels: Array<any>;
  guilds: Array<Guild>;
  session_id: string;
  shard?: [number, number];
}
