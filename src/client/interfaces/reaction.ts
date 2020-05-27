import { Role } from "./role.ts";
import { User } from "./user.ts";

// https://discord.com/developers/docs/resources/channel#reaction-object
export interface Reaction {
  count: number;
  me: boolean;
  emoji: Emoji;
}

// https://discord.com/developers/docs/resources/emoji#emoji-object
export interface Emoji {
  id: string;
  name: string;
  roles?: Array<Role>;
  user?: User;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}
