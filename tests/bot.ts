import { Client } from "../mod.ts";
import * as dotenv from "https://deno.land/x/denoenv/mod.ts";
const env = dotenv.config();

const client = new Client({
  token: env.TOKEN,
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  if (ctx.event === "MESSAGE_CREATE") {
    console.log(`A messge was created by ${ctx.d.author.username} that says: ${ctx.d.content}`)
  }
}
