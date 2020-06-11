// https://discord.com/developers/docs/resources/user#user-object
import { Client } from "../../Client.ts";
import { Channel, User, Overwrite } from "../../interfaces/interface_export.ts";

export class ChannelStruct {
  public id!: string;
  public guildID?: string;
  public position?: number;
  public permissionOverwrites?: Array<Overwrite>;
  public name?: string;
  public topic?: string | null = null;
  public nsfw?: boolean = false;
  public lastMessageID?: string;
  public bitrate?: number;
  public userLimit?: number;
  public rateLimitPerUser?: number;
  public recipients?: Array<User>;
  public icon?: string;
  public ownerID?: string;
  public applicationID?: string;
  public parentID?: string;
  public lastPinTimestamp?: string;

  constructor(private payload: Channel) {
    this.id = this.payload.id;
    this.guildID = this.payload.guild_id;
    this.permissionOverwrites = this.payload.permission_overwrites;
    this.name = this.payload.name;
    this.topic = this.payload.topic;
    this.nsfw = this.payload.nsfw;
    this.lastMessageID = this.payload.last_message_id;
    this.bitrate = this.payload.bitrate;
    this.userLimit = this.payload.user_limit;
    this.rateLimitPerUser = this.payload.rate_limit_per_user;
    this.recipients = this.payload.recipients;
    this.icon = this.payload.icon;
    this.ownerID = this.payload.owner_id;
    this.applicationID = this.payload.application_id;
    this.parentID = this.payload.parent_id;
    this.lastPinTimestamp = this.payload.last_pin_timestamp;
  }

  get toString() {
    return `<#${this.id}>`;
  }
}
