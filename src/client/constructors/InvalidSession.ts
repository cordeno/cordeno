import { Client } from "../Client.ts";

export class InvalidSession {
  public canResume!: boolean;

  constructor(private client: Client, private payload: any) {
    this.canResume = this.payload.d;
  }
}
