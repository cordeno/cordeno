interface IClientEvent {
  payload: any;
  data?: object;
}

export function ClientEvent<T extends IClientEvent>(constructor: T) {
  (constructor as any).event = constructor.payload.t;
  (constructor as any).data = constructor.payload.d;
  return constructor;
}
