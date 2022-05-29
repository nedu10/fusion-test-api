import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TransactionEntity, TransactionStatus, TransactionType } from 'Contracts/enum'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('reference').notNullable()
      table.float('amount').notNullable()
      table.enum('status', Object.values(TransactionStatus)).defaultTo(TransactionStatus.PENDING).nullable()
      table.enum('entity', Object.values(TransactionEntity)).notNullable()
      table.enum('type', Object.values(TransactionType)).defaultTo(TransactionType.CREDIT).nullable()
      table.text('payload')
      table.bigInteger('payment_date')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
