import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { ReqQueue } from './ReqQueue.ts'

export class ReqHandler {
  private restRL: Map<any, any> = new Map();
  private queue = new Map<string, ReqQueue>()

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

    const request = async () => {
      body = JSON.stringify(body);
      let res = await fetch(Discord.Rest + route, {
        method: "POST",
        headers,
        body,
      });
    }

    if (!this.queue.get(route)) {
      console.log(res.headers)
      this.queue.set(route, new ReqQueue())
    }
    this.queue.get(route)?.add(request)

    //res = await res.json();
    //return res;
  }
}
