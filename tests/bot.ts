import {
  Client,
  Message,
  Ready,
  Ratelimit,
  Heartbeat,
  Resumed,
  InvalidSession,
} from "../mod.ts";

const client = new Client({
  token: "YOUR_TOKEN",
});

console.log(`Running cordeno v${client.version}`);

for await (const ctx of client) {
  switch (ctx.event) {
    case "READY": {
      const ready: Ready = ctx;

      console.log("Cordeno is now ready!");
      console.log("Discord websocket API version is " + ready.gatewayVersion);

      // Sets client presence
      client.user.setPresence({
        status: "online",
        game: {
          name: "Taking over the world!",
          type: "playing",
        },
      });
      break;
    }
    case "RESUMED": {
      const resumed: Resumed = ctx;
      console.log(`Resumed at: ${resumed.resumeTime}`);
      break;
    }
    case "INVALID_SESSION": {
      const session: InvalidSession = ctx;
      console.log(
        `An invalid session occured. Can resume from previous state?: ${session.canResume}`,
      );
    }
    case "RATELIMIT": {
      const ratelimit: Ratelimit = ctx;
      console.log(`A rate limit was hit for the route: ${ratelimit.route}`);
      // deno-fmt-ignore
      console.log(`The ratelimit will reset in ${Math.round(ratelimit.resetIn / 1000 * 10) / 10}s`);
      break;
    }

    case "HEARTBEAT": {
      const heartbeat: Heartbeat = ctx;
      // deno-fmt-ignore
      console.log(
        "Heartbeat recieved: \n" +
        `=>total: ${heartbeat.total}\n=>rate: ${Math.round(heartbeat.rate / 1000 * 10) / 10}s`
        );
      break;
    }
    case "MESSAGE_CREATE": {
      const msg: Message = ctx;
      if (msg.author.id !== client.user.id) {
        if (msg.content === "!ping") {
          await msg.reply(`Pong!`);
          await msg.reply(`Message author: ${msg.author.username}`);
          await msg.reply(`Created at: ${msg.createdAt}`);
          await msg.reply(`Client name: ${client.user.name}`);
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