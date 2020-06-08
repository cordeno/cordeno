import { Util } from "./Util.ts";
const EPOCH = 1420070400000;

export class Snowflake {
  constructor() {
  }

  static parse(snowflake: string) {
    const bin: string = Util.stringToBin(snowflake).padStart(64, "0");
    return {
      timestamp: parseInt(bin.substring(0, 42), 2) + EPOCH,
    };
  }
}
