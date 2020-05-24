import { connectWebSocket, WebSocket } from "../../../deps.ts";
import { Discord, Payload, OPCODE } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../client.ts";

export class WebSocketManager {
  private socket!: WebSocket;
  constructor(private client: Client) {
  }

  async connect() {
    this.socket = await connectWebSocket(Discord.Endpoint);

    for await (const msg of this.socket) {
      const payload: Payload = JSON.parse(msg.toString());
      console.log(payload);

      switch (payload.op) {
        case OPCODE.Hello: {
          this.identify();
        }
      }
    }
  }
  async identify() {
    console.log(this.client.options.token);
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
}
