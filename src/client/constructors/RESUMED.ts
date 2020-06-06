import { Client } from "../Client.ts";

export class Resumed {
  public resumeTime!: Date;

  constructor(private client: Client, private payload: any) {
    this.resumeTime = new Date();
  }
}
