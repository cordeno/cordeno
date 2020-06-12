// https://discord.com/developers/docs/resources/user#user-object
import { Client } from "../../Client.ts";
import { Emoji, User, Role } from "../../interfaces/interface_export.ts";
import { Snowflake } from "../../../util/Snowflake.ts";

export class EmojiStruct {
    private id: string | null = null;
    private name: string | null = null;
    private roles?: Array<Role>;
    private user?: User;
    private requireColons?: boolean;
    private managed?: boolean;
    private animated?: boolean;
    private available?: boolean;

  constructor(private payload: Emoji) {
    this.id = this.payload.id;
    this.name = this.payload.name;
    this.roles = this.payload.roles;
    this.user = this.payload.user
    this.requireColons = this.payload.require_colons
    this.managed = this.payload.managed
    this.animated = this.payload.animated
    this.available = this.payload.available
  }
}
