export class ReqQueue {
  private queue: Array<any> = []
  private length = 0

  add (i: Function) {
      this.queue.push(i)
      this.length++
  }
  check () {

  }
}