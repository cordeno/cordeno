import { Client } from "../Client.ts";
import * as Interfaces from "../interfaces/interface_export.ts";

export class INVALID_SESSION {
  public canResume!: boolean;

  constructor(private client: Client, private payload: any) {
    this.canResume = this.payload.d;
  }
}
