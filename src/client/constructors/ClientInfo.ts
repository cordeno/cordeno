import { Client } from "../Client.ts";

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

export class ClientInfo {
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
}
