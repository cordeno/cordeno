// https://discord.com/developers/docs/resources/guild#guild-object
import { Client } from "../../Client.ts";
import { Snowflake } from "../../../util/Snowflake.ts";
import { Guild, Message } from "../../interfaces/interface_export.ts";

export class GuildStruct {
  public id!: string;
  public name!: string;
  public icon!: string | null;
  public splash!: string;
  public owner: boolean | undefined = false;
  public ownerID!: string;
  public joinedAt!: Date;

  constructor(private client: Client, private payload: Guild & Message) {
    this.id = payload.guild_id;
    const guild: Guild = this.client.cache.guild.get(this.id);
    this.name = guild.name;
    this.icon = guild.icon;
    this.owner = guild.owner;
    this.ownerID = guild.owner_id;
    this.joinedAt = new Date(guild.joined_at);
  }

  get createdTimestamp() {
    return Snowflake.parse(this.id).timestamp;
  }
  get createdOn() {
    return new Date(this.createdTimestamp);
  }
}
