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
          await msg.reply(`Pong!`);
          await msg.reply(`Message author: ${msg.author.username}`);
          await msg.reply(`Created at: ${msg.createdAt}`);
          await msg.reply(`-`);
          await msg.reply(`--`);
          await msg.reply(`1`);
          await msg.reply(`2`);
          await msg.reply(`3`);
          await msg.reply(`4`);
          await msg.reply(`5`);
          await msg.reply(`6`);
          await msg.reply(`7`);
          await msg.reply(`8`);
          await msg.reply(`9`);
          await msg.reply(`10`);
          await msg.reply(`11`);


          continue;
        }
      }
      break;
    }
  }
}
