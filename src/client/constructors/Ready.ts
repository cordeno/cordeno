import { Client } from "../Client.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export class Ready implements Interfaces.Ready {
  public event!: string;
  v!: number;
  user!: Interfaces.User;
  private_channels!: Array<any>;
  guilds!: Array<Interfaces.Guild>;
  session_id!: string;
  shard!: [number, number];

  constructor(private client: Client, private payload: any) {
  }
}
