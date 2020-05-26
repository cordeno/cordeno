import { Client } from "../Client.ts";
import * as Interfaces from "../interfaces/discord.ts";

export class Message implements Interfaces.Message {
  public event!: string;
  id!: string;
  channel_id!: string;
  guild_id?: string;
  author!: Interfaces.User;
  member?: Interfaces.GuildMember;
  content!: string;
  timestamp!: string;
  edited_timestamp!: string;
  tts!: boolean;
  mention_everyone!: boolean;
  mentions!: Array<Interfaces.User & Interfaces.GuildMember>;
  mention_roles!: Array<Interfaces.Role>;
  mention_channels?: Array<Interfaces.ChannelMention>;
  attachments!: Array<Interfaces.Attachment>;
  embeds!: Array<Interfaces.Embed>;
  reactions?: Array<Interfaces.Reaction>;
  nonce?: number | string;
  pinned!: boolean;
  webhook_id?: string;
  type!: number;
  activity?: Interfaces.Activity;
  application?: Interfaces.Application;
  message_reference?: Interfaces.MessageReference;
  flags?: number;

  constructor(public client: Client, public payload: any) {
  }
  async reply(msg: string) {
    this.client.http.post(`/channels/${this.payload.d.channel_id}/messages`, {
      "content": msg,
      "tts": false,
    });
  }
}
