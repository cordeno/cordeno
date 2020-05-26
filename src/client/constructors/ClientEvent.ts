interface IClientEvent {
  payload: any;
  data?: object;
}

export function ClientEvent<T extends IClientEvent>(constructor: T) {
  (constructor as any).event = constructor.payload.t;
  constructor = Object.assign(constructor, constructor.payload.d);
  return constructor;
}
