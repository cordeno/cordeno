// https://discord.com/developers/docs/resources/channel#message-object

import { Client } from "../Client.ts";
import { UserStruct } from "./struct/UserStruct.ts";
import { GuildStruct } from "./struct/GuildStruct.ts";
import { ChannelStruct } from "./struct/ChannelStruct.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export interface MessageOptions {
  mention?: boolean;
  tts?: boolean;
  embed?: {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: Date;
    color?: number;
    footer?: { text: string; icon_url?: string; proxy_icon_url?: string };
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
    video?: { url?: string; height?: number; width?: number };
    provider?: { name?: string; url?: string };
    author?: {
      name?: string;
      url?: string;
      icon_url?: string;
      proxy_icon_url?: string;
    };
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  };
}

export class MESSAGE_CREATE {
  public author!: UserStruct;
  public createdAt!: Date;
  public editedAt!: Date | null;
  public content!: string;
  public member!: Interfaces.GuildMember | null;
  public guild!: GuildStruct;
  public channel!: ChannelStruct;

  constructor(private client: Client, private payload: any) {
    const data: Interfaces.Message = this.payload.d;
    this.author = new UserStruct(data.author);
    // this.guild = new GuildStruct(discordGuild, client); - `discordGuild` should be a cached guild object that uses data.guild_id
    // this.channel = new ChannelStruct(discordChannel, client); - `discordChannel` should be a cached channel object that uses data.channel_id
    this.createdAt = new Date(data.timestamp);
    this.editedAt = (data.edited_timestamp)
      ? new Date(data.edited_timestamp)
      : null;
    this.content = data.content;
  }

  async reply(
    msg?: string,
    options: MessageOptions = { mention: false, tts: false },
  ) {
    if (options.mention) {
      msg = `<@${this.author.id}> ${msg}`;
    }

    await this.client.http.post(
      `/channels/${this.payload.d.channel_id}/messages`,
      {
        content: msg,
        tts: options.tts,
        embed: options.embed,
      },
    );
  }
}
