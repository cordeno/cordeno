export function ClientEvent(constructor: any) {
  (constructor as any).event = constructor.payload.event;
  return constructor;
}
