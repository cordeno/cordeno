import { Cordeno, CordenoOptions } from "./constant/cordeno.ts";
import { WebSocketManager } from "./ws/WebSocketManager.ts";
import { ReqHandler } from "./rest/ReqHandler.ts";
import * as Constructor from "./constructors/constructor_export.ts";
import { AsyncEventQueue } from "./Queue.ts";
import { DenoAsync } from "../../deps.ts";

export class Client {
  ws: WebSocketManager = new WebSocketManager(this);
  http: ReqHandler;
  options!: CordenoOptions;
  event: AsyncEventQueue = new AsyncEventQueue();
  public user!: Constructor.ClientInfo;

  private mux = new DenoAsync.MuxAsyncIterator<any>();

  private async *[Symbol.asyncIterator]() {
    for await (const payload of this.mux) {
      switch (payload.event) {
        /* Discord API events */
        case "READY": {
          // deno-fmt-ignore
          yield Constructor.ClientEvent(new Constructor.Ready(this, payload));
          break;
        }
        case "MESSAGE_CREATE": {
          // deno-fmt-ignore
          yield Constructor.ClientEvent(new Constructor.Message(this, payload));
          break;
        }
        /* Client events */
        case "HEARTBEAT": {
          // deno-fmt-ignore
          yield Constructor.ClientEvent(new Constructor.Heartbeat(this, payload))
          break;
        }
        case "RATELIMIT": {
          // deno-fmt-ignore
          yield Constructor.ClientEvent(new Constructor.Ratelimit(this, payload));
          break;
        }
      }
    }
  }

  constructor(options: CordenoOptions) {
    this.options = options;
    if (!options.token) {
      throw new Error("A token must be specified when initiating `Client`");
    }
    this.ws.connect();
    this.http = new ReqHandler(this);
    this.mux.add(this.event.queue());
    this.user = new Constructor.ClientInfo(this);
  }

  get version(): string {
    return Cordeno.Version;
  }
}
