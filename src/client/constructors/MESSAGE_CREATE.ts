// https://discord.com/developers/docs/resources/channel#message-object

import { Client } from "../Client.ts";
import { UserStruct } from "./struct/User.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export interface MessageOptions {
  mention?: boolean;
  tts?: boolean;
}

export class MESSAGE_CREATE {
  public author!: UserStruct;
  public createdAt!: Date;
  public editedAt!: Date | null;
  public content!: string;
  public member!: Interfaces.GuildMember | null;

  constructor(private client: Client, private payload: any) {
    const data: Interfaces.Message = this.payload.d;
    this.author = new UserStruct(data.author);
    this.createdAt = new Date(data.timestamp);
    this.editedAt = (data.edited_timestamp)
      ? new Date(data.edited_timestamp)
      : null;
    this.content = data.content;
  }

  async reply(
    msg: string,
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
      },
    );
  }
}
