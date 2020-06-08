import { Client } from "../Client.ts";

export class HEARTBEAT {
  public recieved!: string;
  public rate!: number;
  public total!: number;

  constructor(private client: Client, private payload: any) {
    this.recieved = this.payload.recieved;
    this.rate = this.payload.rate;
    this.total = this.payload.total;
  }
}
