import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TransactionEntity, TransactionStatus, TransactionType } from 'Contracts/enum';

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public reference: string;

  @column()
  public user_id: number;

  @column()
  public amount: number;

  @column()
  public status: TransactionStatus;

  @column()
  public type: TransactionType;

  @column()
  public entity: TransactionEntity;

  @column()
  public payload: string;

  @column()
  public payment_date: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
