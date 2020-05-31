import { Client } from "../Client.ts";

export class ReqQueue {
  private queue: Array<any> = [];
  private length = 0;
  private limit: number = -1;
  private remaining: number = -1;
  private reset: number = -1;
  private resetAfter: number = -1;
  private isBusy: boolean = false;

  constructor(private client: Client) {
  }

  push(i: Function) {
    if (this.length === 0) {
      return this.execute(i);
    }
    this.queue.push(i);
    this.length++;
  }
  execute(req: Function) {
  }
}
