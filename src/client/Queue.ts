// Copyright (c) 2020 Oliver Lenehan. All rights reserved. MIT license.

/**
 * This queue system is based off the source found under Dinocord: https://github.com/sunsetkookaburra/dinocord/blob/master/api/queue.ts
 * This code is registered under the MIT license: https://github.com/sunsetkookaburra/dinocord/blob/master/LICENCE
 * It has been modified from its original form
 */
import { DenoAsync } from "../../deps.ts";

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
  private newItem = DenoAsync.deferred();
  private _queue = new Queue();
  constructor(
    private flowRate: number = 0,
    private handler?: (item: T) => void,
  ) {}
  /** Post an event to the queue. */
  post(event: string = "UNKNOWN", item: T) {
    this._queue.add({
      event,
      ...item,
    });
    this.newItem.resolve();
  }
  /** Stop serving events. */
  exit() {
    this.isDone = true;
    this.newItem.resolve();
  }

  async *queue() {
    while (1) {
      // if there are items in the queue, pop them one by one.
      if (this._queue.length > 0) {
        // yield the value
        yield this._queue.pop() as T;
        // wait for the desired time so as to act as 'flow control'
        if (this.flowRate !== 0) await DenoAsync.delay(this.flowRate);
      } // else: there are no items in the queue currently
      else {
        // await next item to arrive in queue, or exit() as it resolves this promise
        await this.newItem;
        // reset the promise to be unresolved
        this.newItem = DenoAsync.deferred();
      }
      // if exit() was called this is true, and the generator exits.
      if (this.isDone) return;
    }
  }
}
