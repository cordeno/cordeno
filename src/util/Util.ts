export class Util {
  constructor() {
  }

  static stringToBin(str: string) {
    return (BigInt(str)).toString(2);
  }
}
