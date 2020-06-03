export function ClientEvent(constructor: any) {
  (constructor as any).event = constructor.payload.event;
  if (constructor.payload.d) {
    constructor = Object.assign(constructor, constructor.payload.d);
  }
  return constructor;
}
