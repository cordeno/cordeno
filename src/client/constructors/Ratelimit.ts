import { Client } from "../Client.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export class RATELIMIT {
  public route!: string;
  public resetIn!: number;

  constructor(private client: Client, private payload: any) {
    this.route = this.payload.route;
    this.resetIn = this.payload.resetIn;
  }
}
