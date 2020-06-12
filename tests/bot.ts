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
        game: {
          name: "Taking over the world!",
          type: "playing",
        },
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
        let prefix = '!'
        let args: Array<string> = msg.content
        .slice(Object.keys(prefix).length)
        .trim()
        .split(/ +/g);
        let cmd = args?.shift()?.toLowerCase();

        switch (cmd) {
          case 'ping': {
            await msg.reply(`Pong!`);
            await msg.reply(`Message author: ${msg.author.username}`);
            await msg.reply(`User created at: ${msg.author.createdOn}`);
            await msg.reply(`Created at: ${msg.createdAt}`);
            await msg.reply(`Client name: ${client.user.name}`);
            /* await msg.reply(`Current Guild: ${msg.guild.name}`)
          await msg.reply(`Current Channel: ${msg.channel.name}`)
            await msg.reply(`Current Channel: ${msg.channel.name}`) 
          - Waiting for Guild and Channel Caching - see MESSAGE_CREATE.ts constructor*/
          continue;
          }
          case 'cordeno': {
            await msg.reply(
              "",
              {
                embed: {
                  title: `Cordeno version: v${client.version}`,
                  color: 0x2f3136,
                },
              },
            );
          }
          case 'guildinfo': {
            let icon = msg.guild.getIconURL()
            let pruneCount = await msg.guild.getPrune()
            let channels = await msg.guild.getChannels()
            let members = await msg.guild.getMembers()
            let roles = await msg.guild.getRoles()
            await msg.channel.send('', {embed: {color: 0x2f3136, author: {icon_url: icon, name: msg.guild.name}, fields: [{name: 'Members', value: members.length, inline: true}, {name: 'Roles', value: roles.length, inline: true}, {name: 'Channels', value: channels.length, inline: true}, {name: 'Prune', value: pruneCount.length, inline: true}]}})
          }
          case 'newrole': {
             msg.guild.createRole(args[0], {color: Number.parseInt(args[1]), permissions: Number.parseInt(args[3]), mentionable: args[2] === "true"}).then((role) => {
               msg.channel.send('', {embed: {color: 0x2f3136, description: `:white_check_mark: Created new role **${args[0] ? args[0] : 'new role'}** ${args[1] ? `With color **${args[1]}**` : ''} that is ${args[2] === "true" ? '' : '**not**'} mentionable${args[3] ? `With permissions: **${args[3]}**` : ''}!`}})
             })
          }
          case 'newchannels': {
            if (!args[0]) msg.reply('You must supply a channel name!')
            else msg.guild.createChannel(args[0], {type: Number.parseInt(args[1]), topic: args.slice(3).join(' '), rate_limit_per_user: Number.parseInt(args[2])}).then((role) => {
              msg.channel.send('', {embed: {color: 0x2f3136, description: `:white_check_mark: Created new channel **${args[0]}** ${args[3] ? `With topic **${args.slice(3).join(' ')}**` : ''} that is type ${args[1] ? args[1] : '0'}!`}})
            })
         }

        }
        /* else if (msg.content === "!nuke") {
          msg.channel.send('',{embed: {title: `💣 Nuking Channel: **${msg.channel.name}**...`, color: 0x2f3136}})
          await msg.channel.delete()
        } 
        
        - Waiting for DELETE request - see ReqHandler.ts */
      }
      break;
    }
  }
}
