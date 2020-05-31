import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../Client.ts";
import { ReqQueue } from "./ReqQueue.ts";
import { Request } from "./Request.ts";

export class ReqHandler {
  private restRL: Map<any, any> = new Map();
  private queue = new Map<string, ReqQueue>();

  constructor(private client: Client) {
  }
  async get(route: string) {
    const request: Request = new Request(route, {
      client: this.client,
    });
    let res = await request.fire();
    return res;
  }

  async post(route: string, body?: object | string) {
    const request: Request = new Request(route, {
      method: "POST",
      body,
      client: this.client,
    });
    let res = await request.fire();
    return res;
  }
}
