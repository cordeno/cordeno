import { Client } from "../Client.ts";
import { Guild } from "../interfaces/guild.ts";
import { Payload } from "../constant/discord.ts";
import { GuildStruct } from "./struct/GuildStruct.ts";

export class GUILD_CREATE {
  constructor(private client: Client, private payload: Payload) {
    const data: Guild = payload.d;
    console.log(data);
    this.client.cache.guild.set(data.id, new GuildStruct(client, payload.d));
  }
}
