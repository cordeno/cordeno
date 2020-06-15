import {
  Client,
  MESSAGE_CREATE,
  READY,
  RATELIMIT,
  HEARTBEAT,
  RESUMED,
  INVALID_SESSION,
  ev,
} from "../mod.ts";
import * as dotenv from "https://deno.land/x/denoenv/mod.ts";
const env = dotenv.config();

const client = new Client({
  token: env.TOKEN,
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  switch (ctx.event) {
    case ev.Ready: {
      const ready: READY = ctx;

      console.log("Cordeno is now ready!");
      console.log("Discord websocket API version is " + ready.gatewayVersion);

      // Sets client presence
      client.user.setPresence({
        status: "online",
      });
      break;
    }
    case ev.Resumed: {
      const resumed: RESUMED = ctx;
      if (resumed.reconnectRequested) {
        console.log("Discord API requested a reconnect.");
        break;
      }
      console.log(`Resumed at: ${resumed.resumeTime}`);
      break;
    }
    case ev.InvalidSession: {
      const session: INVALID_SESSION = ctx;
      console.log(
        `An invalid session occured. Can resume from previous state?: ${session.canResume}`,
      );
      break;
    }
    case ev.Ratelimit: {
      const ratelimit: RATELIMIT = ctx;
      console.log(`A rate limit was hit for the route: ${ratelimit.route}`);
      // deno-fmt-ignore
      console.log(`The ratelimit will reset in ${Math.round(ratelimit.resetIn / 1000 * 10) / 10}s`);
      break;
    }

    case ev.Heartbeat: {
      const heartbeat: HEARTBEAT = ctx;
      // deno-fmt-ignore
      console.log(
        "Heartbeat recieved: \n" +
        `=>total: ${heartbeat.total}\n=>rate: ${Math.round(heartbeat.rate / 1000 * 10) / 10}s`
        );
      break;
    }
    case ev.Message: {
      const msg: MESSAGE_CREATE = ctx;
      if (msg.author.id !== client.user.id) {
        let prefix = "!";
        let args: Array<string> = msg.content
          .slice(Object.keys(prefix).length)
          .trim()
          .split(/ +/g);
        let cmd = args?.shift()?.toLowerCase();

        switch (cmd) {
          case "ping": {
            await msg.reply(`Pong!`);
            await msg.reply(`Message author: ${msg.author.username}`);
            await msg.reply(`User created at: ${msg.author.createdOn}`);
            await msg.reply(`Created at: ${msg.createdAt}`);
            await msg.reply(`Client name: ${client.user.name}`);
            console.log(msg.channel.id);
            break;
          }
          case "cordeno": {
            await msg.reply(`Cordeno v${client.version}`, {
              mention: true,
            });
            break;
          }
        }
      }
      break;
    }
  }
}
