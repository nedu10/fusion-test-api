import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Beneficiaries extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('account_number').notNullable()
      table.string('bank_name').notNullable()
      table.string('account_name').notNullable()
      table.string('bank_code').nullable()
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
