import { Client } from "../Client.ts";

export class RESUMED {
  public reconnectRequested: boolean = false;
  public resumeTime: Date | null = null;

  constructor(private client: Client, private payload: any) {
    if (this.payload.reconnectRequested) {
      this.reconnectRequested = this.payload.reconnectRequested;
    } else {
      this.resumeTime = new Date();
    }
  }
}
