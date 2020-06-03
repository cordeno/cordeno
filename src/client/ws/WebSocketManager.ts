import { connectWebSocket, WebSocket } from "../../../deps.ts";
import { Discord, Payload, OPCODE } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../Client.ts";

export class WebSocketManager {
  public socket!: WebSocket;
  private heartbeat = {
    interval: 0,
    recieved: true,
    rate: 0,
    total: 0,
  };
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
        }
      } else {
      }
    }
  }

  // Reconnects to API
  async reconnect() {
    this.panic();
    this.connect();
  }

  // Indentifies client to discord
  async identify() {
    this.socket.send(JSON.stringify({
      op: OPCODE.Identify,
      d: {
        token: this.client.options.token,
        properties: {
          $os: "linux",
          $browser: `${Cordeno.Name} v${Cordeno.Version}`,
          $device: `${Cordeno.Name} v${Cordeno.Version}`,
        },
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
    this.heartbeat.recieved = true;
    if (this.heartbeat.interval) clearInterval(this.heartbeat.interval);
    if (!this.socket.isClosed) this.socket.close();
  }
}
