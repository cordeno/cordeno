// https://discord.com/developers/docs/resources/channel#channel-object
import { Client } from "../../Client.ts";
import { Channel } from "../../interfaces/interface_export.ts";

export class ChannelStruct {
  public id!: string | undefined;

  constructor(private client: Client, private payload: Channel) {
    this.id = payload.guild_id;
  }
}
