import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";

export class ReqHandler {
  constructor(private token: string) {
  }
  async post(route: string, body: object | string) {
    let headers = new Headers([
      ["Authorization", `Bot ${this.token}`],
      ["User-Agent", `${Cordeno.Name} v${Cordeno.Version}`],
      ["X-RateLimit-Precision", "second"],
      ["Content-Type", "application/json"],
    ]);
    body = JSON.stringify(body);
    const res = await fetch(Discord.Rest + route, {
      method: "POST",
      headers,
      body: body,
    });
    return res;
  }
}
