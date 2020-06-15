import { Client } from "../Client.ts";
import { Guild } from "../interfaces/guild.ts";
import { Payload } from "../constant/discord.ts";

export class GUILD_CREATE {
  constructor(private client: Client, private payload: Payload) {
    const data: Guild = payload.d;
    this.client.cache.guild.set(data.id, payload.d);
  }
}
