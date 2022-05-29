import { DateTime } from 'luxon'
import { afterCreate, BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

import Hash from "@ioc:Adonis/Core/Hash";
import WalletService from 'App/Services/Account/WalletManagement';


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public remember_me_token: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @afterCreate()
  public static async createWallet(user: User) {
    WalletService.create_wallet({user_id: user.id})
  }
}
