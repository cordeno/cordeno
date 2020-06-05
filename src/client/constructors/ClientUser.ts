import { Client } from "../Client.ts";
import { OPCODE } from "../constant/discord.ts";

interface IClientInfo {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

interface Presence {
  since?: number;
  game?: {
    name: string;
    type: "playing" | "streaming" | "listening" | number;
    url?: string;
  };
  status?: "online" | "dnd" | "idle" | "invisible" | "offline";
  afk?: boolean;
}

export class ClientUser {
  private _client!: IClientInfo;
  constructor(private client: Client) {
    this.init();
  }

  private async init() {
    this._client = await this.client.http.get("/users/@me");
  }
  get id() {
    return this._client.id;
  }
  get name() {
    return this._client.username;
  }
  get discriminator() {
    return this._client.discriminator;
  }
  get avatar() {
    return this._client.avatar;
  }
  get bot() {
    return this._client.bot;
  }

  setPresence(options: Presence) {
    switch (options.game?.type) {
      case "playing": {
        options.game.type = 0;
        break;
      }
      case "streaming": {
        options.game.type = 1;
        break;
      }
      case "listening": {
        options.game.type = 2;
      }
    }
    return this.client.ws.socket.send(JSON.stringify({
      op: OPCODE.PresenceUpdate,
      d: { ...options, since: null, afk: false, status: "online" },
    }));
  }
}
