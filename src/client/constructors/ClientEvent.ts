export function ClientEvent(constructor: any) {
  (constructor as any).event = constructor.payload.t;
  constructor = Object.assign(constructor, constructor.payload.d);
  return constructor;
}
