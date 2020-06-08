import { Client } from "../Client.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export class READY {
  public gatewayVersion!: number;
  public user!: Interfaces.User;
  public privateChannels!: Array<any>;
  public unavailableGuilds!: Array<Interfaces.Guild>;
  public sessionID!: string;
  public shard!: [number, number];

  constructor(private client: Client, private payload: any) {
    this.gatewayVersion = this.payload.d.v;
    this.user = this.payload.d.user;
    this.privateChannels = this.payload.d.private_channels;
    this.unavailableGuilds = this.payload.d.guilds;
    this.sessionID = this.payload.d.session_id;
    client.cache.get("client").sessionID = this.sessionID;
    this.shard = this.payload.d.shard;
  }
}
