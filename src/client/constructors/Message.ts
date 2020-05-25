import { Client } from "../Client.ts";

interface MessageObject {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: any;
  content: string;
  timestamp: string;
}

export class Message {
  public event!: string
  public data!: {
    [key: string]: any
  }
  constructor(private client: Client, public payload: any) {
  }
  async reply(msg: string) {
    this.client.http.post(`/channels/${this.payload.d.channel_id}/messages`, {
      "content": msg,
      "tts": false,
    });
  }
}
