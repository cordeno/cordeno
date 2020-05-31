import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";

export class ReqHandler {
  private restRL: Map<any, any> = new Map();

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
    res = await res.json();
    return res;
  }

  async post(route: string, body?: object | string) {
    let headers = new Headers([
      ["Authorization", `Bot ${this.token}`],
      [
        "User-Agent",
        `DiscordBot (https://deno.land/x/cordeno, ${Cordeno.Version})`,
      ],
      ["X-RateLimit-Precision", "millisecond"],
    ]);
    if (typeof body === "object") {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(body);
    let res = await fetch(Discord.Rest + route, {
      method: "POST",
      headers,
      body,
    });
    const rateLimit = this.ratelimit(new Headers(res.headers));

    res = await res.json();
    return res;
  }

  ratelimit(headers: Headers) {
    const obj: { [k: string]: any } = {
      global: headers.get("X-RateLimit-Global") || null,
      limit: headers.get("X-RateLimit-Limit") || null,
      remaining: headers.get("X-RateLimit-Remaining") || null,
      reset: Number(headers.get("X-RateLimit-Reset")) || null,
      resetAfter: headers.get("X-RateLimit-Reset-After") || null,
      bucket: headers.get("X-RateLimit-Bucket") || null,
    };
    return obj;
  }
}
