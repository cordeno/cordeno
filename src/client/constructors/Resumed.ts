import { Client } from "../Client.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export class Resumed {
  public resumeTime!: Date;

  constructor(private client: Client, private payload: any) {
    this.resumeTime = new Date();
  }
}
