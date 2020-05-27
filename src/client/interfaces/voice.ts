import { GuildMember } from "./user.ts";

// https://discord.com/developers/docs/resources/voice#voice-state-object
export interface Voice {
  guild_id?: string;
  channel_id: string;
  user_id: string;
  member?: GuildMember;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  suppress: boolean;
}
