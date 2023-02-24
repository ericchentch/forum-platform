import { IConditionObject } from '@/src/shared'
import { Logger } from '@nestjs/common'
import { HttpExceptionFilter } from '../exception/exception.handler'
import { executeQuery, generateConditionWhere } from './common.repository'

export class BaseRepository<T> {
  table: string = ''
  clazz: object = {}

  private readonly logger = new Logger(HttpExceptionFilter.name)

  async findAll(params?: IConditionObject[]) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere({
      params,
      clazz: this.clazz,
    })}`
    this.logger.warn(query)
    const result = await executeQuery<T>(query)
    return result
  }

  async findOne(condition: IConditionObject) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere({
      params: [condition],
      clazz: this.clazz,
    })}`
    this.logger.warn(query)
    const result = await executeQuery<T>(query)
    if (result.length > 0) {
      return result[0]
    } else return null
  }
}
