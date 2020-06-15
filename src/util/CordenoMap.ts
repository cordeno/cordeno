export class CordenoMap<K, V> extends Map<K, V> {
  private _array!: V[] | null;
  private _keyArray!: K[] | null;
  constructor() {
    super();
  }
  public get(key: K): V | undefined {
    return super.get(key);
  }
  public set(key: K, value: V): this {
    this._array = null;
    this._keyArray = null;
    return super.set(key, value);
  }
  public has(key: K): boolean {
    return super.has(key);
  }
  public delete(key: K): boolean {
    this._array = null;
    this._keyArray = null;
    return super.delete(key);
  }
  public clear(): void {
    return super.clear();
  }
  public array(): V[] {
    if (!this._array || this._array.length !== this.size) {
      this._array = [...this.values()];
    }
    return this._array;
  }
  public keyArray(): K[] {
    if (!this._keyArray || this._keyArray.length !== this.size) {
      this._keyArray = [...this.keys()];
    }
    return this._keyArray;
  }
}
