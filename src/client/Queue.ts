// Copyright (c) 2020 Oliver Lenehan. All rights reserved. MIT license.

/**
 * This queue system is based off the source found under Dinocord: https://github.com/sunsetkookaburra/dinocord/blob/master/api/queue.ts
 * This code is registered under the MIT license: https://github.com/sunsetkookaburra/dinocord/blob/master/LICENCE
 * If the devs seeing this, thanks again for making the code publicly available :) Dinocord has been a huge inspiration to cordeno.
 */
import { deferred } from "../../deps.ts";

function sleep(ms: number) {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
}

/** A simple queue with add and pop. */
class Queue<T> {
  /** How many items are currently in the queue. */
  length = 0;
  private queueBuffer: T[] = [];
  /** Add an item to the queue. */
  add(item: T): void {
    this.length++;
    this.queueBuffer.unshift(item); // currently just places at front of array.
  }
  /** Remove the next item at the front of the queue. */
  pop(): T | undefined {
    // if > 0, there is an item to pop
    if (this.queueBuffer.length > 0) {
      this.length--;
      return this.queueBuffer.pop(); // currently just removes from back of array.
    }
    // otherwise, nothing was removed.
    return undefined;
  }
}

export class AsyncEventQueue<T = any> {
  /** Whether the queue has been exited. */
  private isDone = false;
  /** Used to await for a new item. */
  private newItem = deferred();
  private queue = new Queue();
  constructor(
    private flowRate: number = 0,
    private handler?: (item: T) => void,
  ) {}
  /** Post an event to the queue. */
  post(item: T) {
    this.queue.add(item);
    this.newItem.resolve();
  }
  /** Stop serving events. */
  exit() {
    this.isDone = true;
    this.newItem.resolve();
  }
  /** used for for-await-of */
  async *[Symbol.asyncIterator]() {
    while (1) {
      // if there are items in the queue, pop them one by one.
      if (this.queue.length > 0) {
        // yield the value
        yield this.queue.pop() as T;
        // wait for the desired time so as to act as 'flow control'
        if (this.flowRate !== 0) await sleep(this.flowRate);
      } // else: there are no items in the queue currently
      else {
        // await next item to arrive in queue, or exit() as it resolves this promise
        await this.newItem;
        // reset the promise to be unresolved
        this.newItem = deferred();
      }
      // if exit() was called this is true, and the generator exits.
      if (this.isDone) return;
    }
  }
  async run() {
    for await (const item of this) {
      if (this.handler !== undefined) this.handler(item);
    }
  }
}
