import { Cordeno, CordenoOptions } from "./constant/cordeno.ts";
import { WebSocketManager } from "./ws/WebSocketManager.ts";
import { ReqHandler } from "./rest/ReqHandler.ts";
import * as Constructor from "./constructors/constructor_export.ts";
import { AsyncEventQueue } from "./Queue.ts";
import { DenoAsync } from "../../deps.ts";

export class Client {
  ws!: WebSocketManager;
  http: ReqHandler;
  options!: CordenoOptions;
  event: AsyncEventQueue = new AsyncEventQueue();
  cache = new Map<string, any>();
  public user!: Constructor.ClientUser;

  private mux = new DenoAsync.MuxAsyncIterator<any>();

  private async *[Symbol.asyncIterator]() {
    for await (const payload of this.mux) {
      try {
        // @ts-ignore deno-fmt-ignore
        yield Constructor.ClientEvent(new Constructor[payload.event](this, payload));
      } catch (e) {
      }
    }
  }

  constructor(options: CordenoOptions) {
    this.options = options;
    if (!options.token) {
      throw new Error("A token must be specified when initiating `Client`");
    }
    this.cache.set("client", {
      sessionID: null,
      sequence: null,
      token: this.options.token,
    });
    this.ws = new WebSocketManager(this)
    this.ws.connect();
    this.http = new ReqHandler(this);
    this.mux.add(this.event.queue());
    this.user = new Constructor.ClientUser(this);
  }

  get version(): string {
    return Cordeno.Version;
  }
}
