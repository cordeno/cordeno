import { connectWebSocket, WebSocket } from "../../../deps.ts";
import { Discord, Payload, OPCODE } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../Client.ts";
import { AsyncEventQueue } from "../Queue.ts";

export class WebSocketManager {
  public socket!: WebSocket;
  private beatInterval!: number;
  private beatRecieved: boolean = true;
  private q!: AsyncEventQueue<Payload>;
  public queue!: any;
  constructor(private client: Client) {
    this.q = new AsyncEventQueue();
    this.queue = this.q.queue();
  }
  async connect() {
    this.socket = await connectWebSocket(Discord.Endpoint);
    for await (const msg of this.socket) {
      if (typeof msg === "string") {
        const payload: Payload = JSON.parse(msg.toString());
        this.q.post(payload);
        switch (payload.op) {
          case OPCODE.Hello: {
            this.identify();
            this.heartbeatInterval(payload.d.heartbeat_interval);
            break;
          }
          case OPCODE.HeartbeatACK: {
            break;
          }
        }
      } else {
      }
    }
  }

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

  async heartbeatInterval(rate: number) {
    if (this.beatRecieved) {
      this.beatInterval = setInterval(() => {
        this.heartbeat();
      }, rate);
      this.beatRecieved = false;
    } else {
      this.panic();
    }
  }

  async heartbeat() {
    this.socket.send(JSON.stringify({
      op: OPCODE.Heartbeat,
      d: null,
    }));
  }
  async panic() {
    //Reconnection code here
  }
}
