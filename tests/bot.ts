import { Client } from "../mod.ts";

const client = new Client({
  token: "TOKEN",
});

console.log(`Running cordeno v${client.version}`);
