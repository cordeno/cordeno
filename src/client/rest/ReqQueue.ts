import { Client } from "../Client.ts";
import { Request } from "./Request.ts";
import { DenoAsync } from "../../../deps.ts";

export class ReqQueue {
  private queue: Array<any> = [];
  private date = 0;
  private limit: number = -1;
  private remaining: number = -1;
  private reset: number = -1;
  private resetAfter: number = -1;
  private isBusy: boolean = false;

  constructor(private client: Client) {
  }

  push(req: Request) {
    if (this.isBusy) {
      this.queue.push(req);
    } else {
      return this.exec(req);
    }
  }

  run(): any {
    if (this.queue.length === 0) return Promise.resolve();
    return this.exec(this.queue.shift());
  }

  exec(request: Request) {
    return new Promise(async (resolve, reject) => {
      if (this.isBusy) {
        this.queue.unshift(request);
        return null;
      }

      this.isBusy = true;

      const ratelimit: boolean = this.remaining <= 0 && Date.now() < this.reset;

      if (ratelimit) {
        await DenoAsync.delay(this.reset - Date.now());
      }

      let res: Response = await request.fire();

      if (res && res.headers) {
        const date = res.headers.get("date");
        const limit = res.headers.get("X-RateLimit-Limit");
        const remaining = res.headers.get("X-RateLimit-Remaining");
        const reset = Number(res.headers.get("X-RateLimit-Reset")) * 1000;
        const resetAfter = Number(res.headers.get("X-RateLimit-Reset-After")) *
          1000;

        this.limit = limit ? Number(limit) : Infinity;
        this.remaining = remaining ? Number(remaining) : 1;
        // deno-fmt-ignore
        this.reset = reset ? (new Date(Number(reset)).getTime()) - (new Date(String(date)).getTime() - Date.now()) : Date.now();
        this.resetAfter = resetAfter ? Number(resetAfter) : -1;
      }

      this.isBusy = false;

      if (res.ok) {
        resolve(res);
        return this.run();
      } else if (res.status === 429) {
        this.client.event.post({
          t: "RATELIMIT",
          d: {
            route: request.route,
            resetIn: this.resetAfter,
          },
        });
        this.queue.unshift(request);
        await DenoAsync.delay(this.resetAfter);
        return this.run();
      }
    });
  }
}
