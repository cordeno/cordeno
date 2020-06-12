// https://discord.com/developers/docs/resources/user#user-object
import { Client } from "../../Client.ts";
import { User } from "../../interfaces/interface_export.ts";
import { Snowflake } from "../../../util/Snowflake.ts";

export class UserStruct {
  public id!: string;
  public username!: string;
  public discriminator!: string;
  public avatar: string | null = null;
  public bot: boolean = false;
  public system?: boolean = false;

  constructor(private payload: User) {
    this.id = this.payload.id;
    this.username = this.payload.username;
    this.discriminator = this.payload.discriminator;
    this.avatar = this.payload.avatar;
    this.system = this.payload.system;
  }

  get createdTimestamp() {
    return Snowflake.parse(this.id).timestamp;
  }

  get createdOn() {
    return new Date(this.createdTimestamp);
  }
}
