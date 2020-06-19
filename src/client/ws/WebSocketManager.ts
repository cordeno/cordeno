/*
Status codes
==============
0 - connected
1 - connecting
2 - reconnecting
3 - ws-no-disconnect
4 - error
*/

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
  private status: number = 1;
  private wsCloseCode: number = 0;
  private clientCache!: any;
  constructor(private client: Client) {
    this.clientCache = client.cache.client.get("client");
  }

  // Connects to API
  async connect() {
    try {
      this.socket = await connectWebSocket(this.clientCache.gateway);

      for await (const msg of this.socket) {
        if (typeof msg === "string") {
          const payload: Payload = JSON.parse(msg.toString());

          //Grabs last sequence number
          if (payload.s) {
            this.clientCache.sequence = payload.s;
          }

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
            case OPCODE.Reconnect: {
              this.client.event.post("RESUMED", {
                reconnectRequested: true,
              });
              await this.reconnect();
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
          this.connectionClosed(msg.code);
          break;
        }
      }
    } catch (e) {
      this.reconnect(true);
    }
  }

  // Reconnects to API
  async reconnect(fresh: boolean = false) {
    await this.panic(fresh ? 1000 : 1012);
    if (!fresh) {
      this.status = 2;
    } else {
      this.status = 1;
    }
    this.connect();
  }

  // Indentifies client to discord
  async identify() {
    if (this.status === 2) {
      return this.resume();
    }
    this.status = 0;
    return this.socket.send(JSON.stringify({
      op: OPCODE.Identify,
      d: {
        token: this.clientCache.token,
        properties: {
          $os: "linux",
          $browser: `${Cordeno.Name} v${Cordeno.Version}`,
          $device: `${Cordeno.Name} v${Cordeno.Version}`,
        },
      },
    }));
  }

  async resume() {
    this.status = 0;
    return this.socket.send(JSON.stringify({
      op: OPCODE.Resume,
      d: {
        token: this.clientCache.token,
        session_id: this.clientCache.sessionID,
        seq: this.clientCache.sequence,
      },
    }));
  }

  // Starts the beat interval
  async heartbeatInterval(rate: number) {
    if (this.socket.isClosed) return this.reconnect();
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
  async panic(code: number = 1000) {
    this.heartbeat.recieved = true;
    clearInterval(this.heartbeat.interval);

    console.log(
      `Close code is not 1000: ${[1000].indexOf(this.wsCloseCode) === -1}`,
    );

    // If sockets still open, close | Don't close socket if closeCode is 1000
    if (!this.socket.isClosed && [1000].indexOf(this.wsCloseCode) === -1) {
      this.socket.close(code).catch();
    }
    this.wsCloseCode = 0;
  }

  // Fired when the socket is disconnected
  connectionClosed(code: number) {
    console.log(`Error code: ${code}`);
    console.log(
      "Discord API: https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes",
    );
    this.wsCloseCode = code;
    switch (code) {
      case 4000: // Unknown error
      case 4007: // Invalid seq
      case 4009: { // Session timed out
        this.reconnect(true);
        break;
      }
      case 4001: // Unknown opcode
      case 4002: // Decode error
      case 4003: { // Not authenticated
        this.reconnect();
        break;
      }
      case 4008: { // Rate limited
        err(new Error("A rate limit occured that could not be handled!"));
        break;
      }
      case 4004: { // Authentication failed
        err(new Error("An invalid token was provided!"));
        break;
      }
      default: {
        this.reconnect(true);
        break;
      }
    }
  }
}
