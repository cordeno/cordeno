import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../Client.ts";
import { ReqQueue } from "./ReqQueue.ts";

interface Options {
  method?: string;
  body?: object | string | null;
  client: Client | null;
}

export class Request {
  constructor(
    public route: string,
    private options: Options = {
      method: "GET",
      body: null,
      client: null,
    },
  ) {
  }

  async fire() {
    let headers = new Headers([
      ["Authorization", `Bot ${this.options.client?.options.token}`],
      [
        "User-Agent",
        `DiscordBot (https://deno.land/x/cordeno, ${Cordeno.Version})`,
      ],
      ["X-RateLimit-Precision", "millisecond"],
    ]);

    let body;
    if (typeof this.options.body === "object") {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(this.options.body);
    }

    const res: any = await fetch(Discord.Rest + this.route, {
      method: this.options.method,
      body,
      headers,
    });
    return res;
  }
}
