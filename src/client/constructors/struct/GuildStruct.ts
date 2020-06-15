// https://discord.com/developers/docs/resources/guild#guild-object
import { Client } from "../../Client.ts";
import { Guild, Message } from "../../interfaces/interface_export.ts";

export class GuildStruct {
  public id!: string;
  // public name!: string;
  // public icon!: string | null;

  constructor(private client: Client, private payload: Guild & Message) {
    this.id = payload.guild_id;
    // this.name = payload.name;
    // this.icon = payload.icon;
  }
}
