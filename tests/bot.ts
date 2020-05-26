import { Client, Message } from "../mod.ts";
import * as dotenv from "https://deno.land/x/denoenv/mod.ts";
const env = dotenv.config();

const client = new Client({
  token: env.TOKEN,
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  if (ctx.event === "MESSAGE_CREATE") {
    const msg: Message = ctx;
    console.log(msg.member.roles);

    if (msg.author.id !== client.user.id) {
      if (msg.content === "!ping") {
        msg.reply("Pong!", {
          ping: true,
        });
      }
    }
  }
}
