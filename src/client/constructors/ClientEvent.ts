export function ClientEvent(constructor: any) {
  constructor["event"] = constructor.payload.t;
  constructor["data"] = constructor.payload.d;
  return constructor
}