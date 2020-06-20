// https://discord.com/developers/docs/resources/channel#channel-object
import { Client } from "../../Client.ts";
import { Message } from "../../interfaces/interface_export.ts";

export class ChannelStruct {
  public id!: string | undefined;

  constructor(private client: Client, private payload: Message) {
    this.id = payload.channel_id;
  }
}
