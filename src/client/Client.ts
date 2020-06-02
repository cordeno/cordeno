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
      switch (payload.t) {
        /* Discord API events */
        case "READY": {
          yield Constructor.ClientEvent(new Constructor.Ready(this, payload));
          break;
        }
        case "MESSAGE_CREATE": {
          yield Constructor.ClientEvent(new Constructor.Message(this, payload));
          break;
        }
        /* Client events */
        case "RATELIMIT": {
          yield Constructor.ClientEvent(
            new Constructor.Ratelimit(this, payload),
          );
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
    this.mux.add(this.ws.queue);
    this.http = new ReqHandler(this);
    this.mux.add(this.event.queue());
    this.user = new Constructor.ClientInfo(this);
  }

  get version(): string {
    return Cordeno.Version;
  }
}
