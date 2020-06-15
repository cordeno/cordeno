import { Cordeno, CordenoOptions } from "./constant/cordeno.ts";
import { CordenoMap } from "../util/CordenoMap.ts";
import { WebSocketManager } from "./ws/WebSocketManager.ts";
import { ReqHandler } from "./rest/ReqHandler.ts";
import * as Constructor from "./constructors/constructor_export.ts";
import { AsyncEventQueue } from "./Queue.ts";
import { DenoAsync } from "../../deps.ts";

export class Client {
  ws!: WebSocketManager;
  http!: ReqHandler;
  options!: CordenoOptions;
  event: AsyncEventQueue = new AsyncEventQueue();
  cache = {
    client: new CordenoMap<string, any>(),
    guild: new CordenoMap<string, any>(),
  };
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
    this._init();
    this.mux.add(this.event.queue());
  }

  async _init() {
    const cache = this.cache.client.set("client", {
      sessionID: null,
      sequence: null,
      gateway: null,
      logins: {
        total: 1000,
        remaining: 1000,
        resetAfter: 0,
      },
      token: this.options.token,
    }).get("client");

    // REST Handler
    this.http = new ReqHandler(this);
    const gatewayInfo: any = await this.http.get("/gateway/bot");

    cache.gateway = gatewayInfo.url + "/?v=6&encoding=json";
    cache.logins.total = gatewayInfo.session_start_limit.total;
    cache.logins.remaining = gatewayInfo.session_start_limit.remaining;
    cache.logins.resetAfter = gatewayInfo.session_start_limit.reset_after;

    // Socket handler
    this.ws = new WebSocketManager(this);
    this.ws.connect();
    // Basic client handler
    this.user = new Constructor.ClientUser(this);
  }
  get version(): string {
    return Cordeno.Version;
  }
}
