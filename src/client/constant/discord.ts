enum Discord {
  Endpoint = "wss://gateway.discord.gg/?v=6&encoding=json",
}

enum OPCODE {
  Dispatch = 0,
  Heartbeat = 1,
  Identify = 2,
  PresenceUpdate = 3,
  VoiceStateUpdate = 4,
  Resume = 6,
  Reconnect = 7,
  RequestGuildMembers = 8,
  InvalidSession = 9,
  Hello = 10,
  HeartbeatACK = 11,
}

interface Payload {
  op: number;
  d: any;
  s?: number;
  t?: string;
}
export {
  Discord,
  Payload,
  OPCODE,
};
