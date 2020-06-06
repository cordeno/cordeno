import { Client } from "../Client.ts";

export class HEARTBEAT {
  public recieved!: string;
  public rate!: number;
  public total!: number;

  constructor(private client: Client, private payload: any) {
    this.recieved = payload.recieved;
    this.rate = payload.rate;
    this.total = payload.total;
  }
}
