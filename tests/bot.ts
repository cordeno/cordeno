import { Client, Message, Ready, Ratelimit } from "../mod.ts";
import * as dotenv from "https://deno.land/x/denoenv/mod.ts";
const env = dotenv.config();

const client = new Client({
  token: env.TOKEN,
});

for await (const ctx of client) {
  switch (ctx.event) {
    case "READY": {
      const ready: Ready = ctx;

      console.log("Cordeno is now ready!");
      console.log("Discord websocket API version is " + ready.v);
      break;
    }
    case "RATELIMIT": {
      const ratelimit: Ratelimit = ctx;
      console.log(`A rate limit was hit for the route: ${ratelimit.route}`);
      // deno-fmt-ignore
      console.log(`The ratelimit will reset in ${Math.round(ratelimit.resetIn / 1000 * 10) / 10} seconds`);
      break;
    }
    case "MESSAGE_CREATE": {
      const msg: Message = ctx;

      if (msg.author.id !== client.user.id) {
        if (msg.content === "!ping") {
          await msg.reply(`Pong!`);
          await msg.reply(`Message author: ${msg.author.username}`);
          await msg.reply(`Created at: ${msg.createdAt}`);
          continue;
        }
        if (msg.content === "!cordeno") {
          await msg.reply(`Cordeno version: v${client.version}`);
        }
      }
      break;
    }
  }
}
