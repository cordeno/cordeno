// https://discord.com/developers/docs/resources/user#user-object
import { Client } from "../../Client.ts";
import { Channel, User, Overwrite } from "../../interfaces/interface_export.ts";

import { Snowflake } from "../../../util/Snowflake.ts";
export interface MessageOptions {
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

  constructor(private payload: Channel, private client: Client) {
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

  /*async delete(
  ) {

    return await this.client.http.delete(
      `/channels/${this.id}/`
    );
  }*/

  /* async setName(name: string, options: { reason?: string}){

    return await this.client.http.patch(
      `/channels/${this.id}/`,
      {
        name: name,
        reason: options.reason
      },
    );
  } 
  
  - Waiting for DELETE and PATCH requests - see RequestHandler.ts */

  async send(
    msg?: string,
    options: MessageOptions = { tts: false },
  ) {
    return await this.client.http.post(
      `/channels/${this.id}/messages`,
      {
        content: msg,
        tts: options.tts,
        embed: options.embed,
      },
    );
  }

  async fetch() {
    return await this.client.http.post(`/channels/${this.id}`)
  }

  async getPins() {
    return await this.client.http.post(`/channels/${this.id}/pins`)
  }

  async bulkDelete(messages: Array<string>, options?: {filterTwoWeeks: Boolean}) {
    messages = options?.filterTwoWeeks ? messages.filter(((id) => Date.now() - Snowflake.parse(String(id)).timestamp < 1209600000)).splice(0, 100) : messages.splice(0, 100)

    return await this.client.http.post(`/channels/${this.id}/messages/bulk-delete`, {messages: messages})
  }

  async createInvite(options?: {maxAge?: number, maxUses?: number, temporary?: Boolean, unique?: Boolean, targetUser?: string, targetUserType?: number}) {
  
    return await this.client.http.post(`/channels/${this.id}/invites`, {max_age: options?.maxAge, max_uses: options?.maxUses, temporary: options?.temporary, unique: options?.unique, target_user: options?.targetUser, target_user_type: options?.targetUserType})
  }

  async getInvites() {
    console.log('req run')
    return await this.client.http.get(`/channels/${this.id}/invites`)
  }

  async triggerTyping() {
    return await this.client.http.post(`/channels/${this.id}/typing`)
  }

  async getMessages(
    limit?: number,
    options?: {before?: string, after?: string, around?: string},
  ) {
    return await this.client.http.get(
      `/channels/${this.id}/messages${limit ? `?limit=${limit}` : `?limit=50`}${options?.before ? `&before=${options.before}` : ''}${options?.after ? `&after=${options?.after}` : ''}${options?.around ? `&around=${options}` : ''}`
    );
  }
}
