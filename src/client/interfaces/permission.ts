// https://discord.com/developers/docs/resources/channel#overwrite-object
export interface Overwrite {
  id: string;
  type: string;
  allow: number;
  deny: number;
}
