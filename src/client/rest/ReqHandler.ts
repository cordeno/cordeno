import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";

export class ReqHandler {
  constructor(private token: string) {
  }
  async get(route: string) {
    let headers = new Headers([
      ["Authorization", `Bot ${this.token}`],
      [
        "User-Agent",
        `DiscordBot (https://deno.land/x/cordeno, ${Cordeno.Version})`,
      ],
      ["X-RateLimit-Precision", "second"],
    ]);

    let res: any = await fetch(Discord.Rest + route, {
      method: "GET",
      headers,
    });
    res = res.json();
    return res;
  }

  async post(route: string, body?: object | string) {
    let headers = new Headers([
      ["Authorization", `Bot ${this.token}`],
      [
        "User-Agent",
        `DiscordBot (https://deno.land/x/cordeno, ${Cordeno.Version})`,
      ],
      ["X-RateLimit-Precision", "second"],
    ]);
    if (typeof body === "object") {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(body);
    const res = await fetch(Discord.Rest + route, {
      method: "POST",
      headers,
      body,
    });
    return res;
  }
}
