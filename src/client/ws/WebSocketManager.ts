import {
  connectWebSocket,
  WebSocket,
  DenoAsync,
  isWebSocketCloseEvent,
} from "../../../deps.ts";
import { Discord, Payload, OPCODE } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../Client.ts";

function err(error: any) {
  console.log("\x1b[31m", error, "\x1b[0m");
  Deno.exit();
}

export class WebSocketManager {
  public socket!: WebSocket;
  private heartbeat = {
    interval: 0,
    recieved: true,
    rate: 0,
    total: 0,
  };
  private status: string = "connecting";
  constructor(private client: Client) {
  }

  // Connects to API
  async connect() {
    this.socket = await connectWebSocket(Discord.Endpoint);

    for await (const msg of this.socket) {
      if (typeof msg === "string") {
        const payload: Payload = JSON.parse(msg.toString());

        if (payload.op === OPCODE.Dispatch) {
          this.client.event.post(payload.t, payload);
        }
        if (payload.s) this.client.cache.get("client").sequence = payload.s;
        switch (payload.op) {
          case OPCODE.Hello: {
            this.identify();
            this.heartbeatInterval(payload.d.heartbeat_interval);
            break;
          }
          case OPCODE.Heartbeat: {
            this.heartbeat.recieved = true;
            this.heartbeatSend();
            break;
          }
          case OPCODE.HeartbeatACK: {
            this.heartbeat.recieved = true;
            break;
          }
          case OPCODE.InvalidSession: {
            this.client.event.post("INVALID_SESSION", payload);
            await DenoAsync.delay(5000);
            if (payload.d === true) {
              this.reconnect();
            } else {
              this.reconnect(true);
            }
            break;
          }
        }
      } else if (isWebSocketCloseEvent(msg)) {
        return this.connectionClosed(msg.code);
      }
    }
  }

  // Reconnects to API
  async reconnect(fresh: boolean = false) {
    this.panic();
    if (!fresh) this.status = "reconnecting";
    else this.status = "connecting";
    this.connect();
  }

  // Indentifies client to discord
  async identify() {
    const opts = this.client.cache.get("client");
    if (this.status === "reconnecting") {
      return this.resume();
    }
    this.status = "connected";
    return this.socket.send(JSON.stringify({
      op: OPCODE.Identify,
      d: {
        token: opts.token,
        properties: {
          $os: "linux",
          $browser: `${Cordeno.Name} v${Cordeno.Version}`,
          $device: `${Cordeno.Name} v${Cordeno.Version}`,
        },
      },
    }));
  }

  async resume() {
    const opts = this.client.cache.get("client");
    this.status = "connected";
    return this.socket.send(JSON.stringify({
      op: OPCODE.Resume,
      d: {
        token: opts.token,
        session_id: opts.sessionID,
        seq: opts.sequence,
      },
    }));
  }

  // Starts the beat interval
  async heartbeatInterval(rate: number) {
    this.heartbeat.rate = rate;
    this.heartbeat.interval = setInterval(() => {
      this.heartbeatSend();
    }, this.heartbeat.rate);
  }

  // Sends a standard heart beat
  async heartbeatSend() {
    if (this.heartbeat.recieved) {
      this.socket.send(JSON.stringify({
        op: OPCODE.Heartbeat,
        d: null,
      }));
      this.heartbeat.recieved = false;
      this.heartbeat.total++;
      this.client.event.post("HEARTBEAT", {
        recieved: this.heartbeat.recieved,
        rate: this.heartbeat.rate,
        total: this.heartbeat.total,
      });
    } else {
      this.reconnect();
    }
  }

  // Fired when something went wrong
  async panic() {
    this.status = "panick";
    this.heartbeat.recieved = true;
    if (this.heartbeat.interval) clearInterval(this.heartbeat.interval);
    if (!this.socket.isClosed) this.socket.close();
  }

  // Fired when the socket is disconnected
  async connectionClosed(code: number) {
    console.log(`Error code: ${code}`);
    console.log('Discord API: https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes')
    switch (code) {
      case 4000:
      case 4007: {
        this.reconnect(true);
        break;
      }
      case 4001:
      case 4002:
      case 4003: {
        this.reconnect();
        break;
      }
      case 4008: {
        err(new Error("A rate limit occured that could not be handled!"));
        break;
      }
      case 4004: {
        err(new Error("An invalid token was provided!"));
        break;
      }
    }
  }
}
