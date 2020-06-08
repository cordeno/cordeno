export class CordenoMap<K, V> extends Map<K, V> {
  constructor() {
    super();
  }
  get(key: K): V | undefined {
    return super.get(key);
  }
}
