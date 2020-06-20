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
  public members!: Array<any>;

  constructor(private client: Client, private payload: Guild) {
    this.id = payload.id;
    this.name = payload.name;
    this.icon = payload.icon;
    this.owner = payload.owner;
    this.ownerID = payload.owner_id;
    this.joinedAt = new Date(payload.joined_at);
    this.members;
  }

  update(payload: Guild) {
    this.name = payload.name;
    this.icon = payload.icon;
    if (payload.owner_id) this.ownerID = payload.owner_id;
  }

  get createdTimestamp() {
    return Snowflake.parse(this.id).timestamp;
  }
  get createdOn() {
    return new Date(this.createdTimestamp);
  }
}
