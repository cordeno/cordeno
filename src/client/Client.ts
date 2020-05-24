import { Cordeno, CordenoOptions } from "./constant/cordeno.ts";
import { WebSocketManager } from "./ws/WebSocketManager.ts";

export class Client {
  private ws: WebSocketManager = new WebSocketManager(this);
  options!: CordenoOptions;
  constructor(options: CordenoOptions) {
    this.options = options;
    if (!options.token) {
      throw new Error("A token must be specified when initiating `Client`");
    }
    this.ws.connect();
  }

  get version(): string {
    return Cordeno.Version;
  }
}
