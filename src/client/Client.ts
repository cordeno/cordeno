import { Cordeno, CordenoOptions } from "./constant/cordeno.ts";
import { WebSocketManager } from "./ws/WebSocketManager.ts";
import { ReqHandler } from "./rest/ReqHandler.ts";
import * as Constructor from "./constructors/constructor_export.ts";

export class Client {
  private ws: WebSocketManager = new WebSocketManager(this);
  http: ReqHandler;
  options!: CordenoOptions;
  public user!: Constructor.ClientInfo;

  private async *[Symbol.asyncIterator]() {
    for await (const payload of this.ws.queue) {
      switch (payload.t) {
        case "READY": {
          yield Constructor.ClientEvent(new Constructor.Ready(this, payload));
          break;
        }
        case "MESSAGE_CREATE": {
          yield Constructor.ClientEvent(new Constructor.Message(this, payload));
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
    this.http = new ReqHandler(options.token);
    this.user = new Constructor.ClientInfo(this);
  }

  get version(): string {
    return Cordeno.Version;
  }
}
