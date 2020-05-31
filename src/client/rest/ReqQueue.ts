import { Client } from "../Client.ts";
import { Request } from './Request.ts'

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

  push(req: Request) {
    if (this.isBusy) {
      console.log(1)
      this.queue.push(req)
    }
    else {
      console.log(2)
      return this.exec(req)
    }
  }
  exec(request: Request) {
    return new Promise(async (resolve, reject) => {
      if (this.isBusy) {
        reject('Worker is busy.');
      }

      this.isBusy = true;

      const limited: boolean = this.remaining <= 0 && Date.now() < this.reset

      let res: Response = await request.fire()

      console.log(res)
      if (res && res.headers) {
        console.log(res.headers)
      }
      return res
    })
  }
}
