import { Client } from "../mod.ts";
import * as dotenv from 'https://deno.land/x/denoenv/mod.ts'
const env = dotenv.config()

console.log(env.TOKEN)
const client = new Client({
  token: env.TOKEN,
});

console.log(`Running cordeno v${client.version}`);
