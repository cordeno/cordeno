import { connectWebSocket, WebSocket } from "../../../deps.ts";
import { Discord, Payload, OPCODE } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../client.ts";

export class WebSocketManager {
  private socket!: WebSocket;
  private beatInterval!: number;
  private beatRecieved: boolean = true;
  constructor(private client: Client) {
  }

  async connect() {
    this.socket = await connectWebSocket(Discord.Endpoint);
    for await (const msg of this.socket) {
      const payload: Payload = JSON.parse(msg.toString());

      if (typeof msg === "string") {
        switch (payload.op) {
          case OPCODE.Hello: {
            this.identify();
            this.heartbeatInterval(payload.d.heartbeat_interval);
          }
          case OPCODE.HeartbeatACK: {
            console.log(payload);
          }
        }
      }
      else {

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
          $browser: Cordeno.Name,
          $device: Cordeno.Name,
        },
      },
    }));
  }

  async heartbeatInterval(rate: number) {
    if (this.beatRecieved) {
      this.beatInterval = setInterval(() => {
        this.heartbeat()
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
