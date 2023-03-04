import { IConditionObject } from '@/src/shared'
import { Logger } from '@nestjs/common'
import { HttpExceptionFilter } from '../exception/exception.handler'
import {
  executeQuery,
  generateConditionWhere,
  generateInsert,
  generateUpdate,
} from './common.repository'

export class BaseRepository<T extends {}> {
  table: string = ''
  clazz: object = {}
  fieldId: string = ''

  private readonly logger = new Logger(HttpExceptionFilter.name)

  async findAll(params?: IConditionObject[]) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere(this.clazz, params)}`
    this.logger.warn(query)
    const result = await executeQuery<T>(query)
    return result
  }

  async findOne(condition: IConditionObject) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere(this.clazz, [condition])}`
    this.logger.warn(query)
    const result = await executeQuery<T>(query)
    if (result.length > 0) {
      return result[0]
    } else return null
  }

  async insertAndUpdate(params: IConditionObject[]) {
    const thisId = params.find((item) => item.key === this.fieldId)
    if (thisId) {
      const condition = {
        key: thisId.key,
        value: String(thisId.value),
      }
      const query = `UPDATE ${this.table} ${generateUpdate(
        params.filter((item) => item.key !== this.fieldId),
        this.clazz
      )} ${generateConditionWhere(this.clazz, [condition])}`
      this.logger.warn(query)
      await executeQuery<T>(query)
    } else {
      const query = `INSERT INTO ${this.table} ${generateInsert(params, this.clazz)}`
      this.logger.warn(query)
      await executeQuery<T>(query)
    }
  }

  async deleteEntity(params: IConditionObject[]) {
    const query = `DELETE FROM ${this.table} ${generateConditionWhere(params)}`
    this.logger.warn(query)
    await executeQuery<T>(query)
  }
}
