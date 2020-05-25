import { Client } from "../mod.ts";
import * as dotenv from "https://deno.land/x/denoenv/mod.ts";
const env = dotenv.config();

const client = new Client({
  token: env.TOKEN,
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  if (ctx.event === 'MESSAGE_CREATE') {
    if (ctx.data.author.id !== '713653377934032937') {
      if (ctx.data.content === '!ping') ctx.reply('Pong!')
    }
  }
}
