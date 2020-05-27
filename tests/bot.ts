import { Client, Message, Ready } from "../mod.ts";
import * as dotenv from "https://deno.land/x/denoenv/mod.ts";
const env = dotenv.config();

const client = new Client({
  token: env.TOKEN,
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  switch (ctx.event) {
    case "READY": {
      const ready: Ready = ctx;

      console.log("Cordeno is now ready!");
      console.log("Discord websocket API version is " + ready.v);
      break;
    }
    case "MESSAGE_CREATE": {
      const msg: Message = ctx;

      if (msg.author.id !== client.user.id) {
        if (msg.content === "!ping") {
          msg.reply("Pong!");
          continue;
        }
      }
      break;
    }
  }
}
