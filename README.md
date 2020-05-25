![Cordeno](https://raw.githubusercontent.com/cordeno/cordeno/master/assets/cordeno-200.gif)
# Cordeno
An simplistic, event loop driven Discord API library for building powerful bots.
<br/>
Powered by the [Deno runtime](https://deno.land/).
<br/>
Inspired by [Dinocord](https://github.com/sunsetkookaburra/dinocord).

# Development progress
Cordeno is still in its **very early stages of development**, and is not production ready. Many cores features of the Discord API is still missing, and has yet to be inplemented.

# Example:
index.ts
```ts
import { Client } from "https://deno.land/x/cordeno/mod.ts";

const client = new Client({
  token: "YOUR TOKEN HERE",
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  if (ctx.event === 'MESSAGE_CREATE') {
    if (ctx.data.author.id !== '713653377934032937') {
      if (ctx.data.content === '!ping') {
        ctx.reply('Pong!')
        continue;
      }
    }
  }
}
```
After creating your file and pasting the above code, run
```shell
deno run --allow-net --reload index.ts
```
The `--reload` tag reinstalls all the dependencies in your project.
<br/>
You don't have to include `--reload` every run, but I recommend including it as an arguement at least once a day to keep cordeno up to date.

# Contributing
Want to contribute? Follow the [Contributing Guide](https://github.com/cordeno/cordeno/blob/master/CONTRIBUTING.md)
