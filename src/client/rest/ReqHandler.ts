import { Discord } from "../constant/discord.ts";
import { Cordeno } from "../constant/cordeno.ts";
import { Client } from "../Client.ts";
import { ReqQueue } from "./ReqQueue.ts";
import { Request } from "./Request.ts";

export class ReqHandler {
  private queue = new Map<string, ReqQueue>();

  constructor(private client: Client) {
  }

  // GET DATA FROM ROUTE
  async get(route: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: Request = new Request(route, {
        method: "GET",
        client: this.client,
        resolve,
        reject,
      });
      if (!this.queue.has(route)) {
        this.queue.set(route, new ReqQueue(this.client));
      }
      let res = this.queue.get(route)?.push(request);
    });
  }

  // POST TO ROUTE
  async post(route: string, body?: object | string) {
    return new Promise((resolve, reject) => {
      const request: Request = new Request(route, {
        method: "POST",
        body,
        client: this.client,
        resolve,
        reject,
      });
      if (!this.queue.has(route)) {
        this.queue.set(route, new ReqQueue(this.client));
      }
      this.queue.get(route)?.push(request);
    });
  }

  // PATCH UP ROUTE
  async patch(route: string, body?: object | string) {
    return new Promise((resolve, reject) => {
      const request: Request = new Request(route, {
        method: "PATCH",
        body,
        client: this.client,
        resolve,
        reject,
      });
      if (!this.queue.has(route)) {
        this.queue.set(route, new ReqQueue(this.client));
      }
      this.queue.get(route)?.push(request);
    });
  }

  // DELETE DATA FROM ROUTE
  async delete(route: string) {
    return new Promise((resolve, reject) => {
      const request: Request = new Request(route, {
        method: "DELETE",
        client: this.client,
        resolve,
        reject,
      });
      if (!this.queue.has(route)) {
        this.queue.set(route, new ReqQueue(this.client));
      }
      this.queue.get(route)?.push(request);
    });
  }
}
