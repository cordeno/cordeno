// https://discord.com/developers/docs/resources/user#user-object
import { Client } from '../../Client.ts'
import { User } from '../../interfaces/user.ts'

export class UserStruct {
  public id!: string;
  public username!: string;
  public discriminator !: string;
  public avatar: string | null = null
  public bot: boolean = false;
  public system?: boolean = false;

  constructor(private payload: User) {
    this.id = this.payload.id;
    this.username = this.payload.username;
    this.discriminator = this.payload.discriminator;
    if (payload.avatar) this.avatar = this.payload.avatar;
    if (payload.system) this.system = this.payload.system;
  }
}
