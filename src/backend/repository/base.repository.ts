import { IConditionObject } from '@/src/shared'
import { Logger } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { HttpExceptionFilter } from '../exception/exception.handler'
import {
  executeQuery,
  generateConditionWhere,
  generateInsert,
  generateUpdate,
  rowMapper,
} from './common.repository'

export class BaseRepository<T extends {}> {
  table: string = ''
  fieldId: string = ''
  clazz: object = {}
  modifiedField: string = ''
  ignoreFields: string[] = []

  private readonly logger = new Logger(HttpExceptionFilter.name)

  async findAll(params?: IConditionObject[]) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere(
      this.clazz,
      this.fieldId,
      params
    )}`
    this.logger.warn(query)
    const result = await executeQuery<T>(query)
    return result.map((item) => rowMapper(item))
  }

  async findOne(condition: IConditionObject) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere(this.clazz, this.fieldId, [
      condition,
    ])}`
    this.logger.warn(query)
    const result = await executeQuery<T>(query)
    if (result.length > 0) {
      return result.map((item) => rowMapper(item))[0]
    } else return null
  }

  async insertAndUpdate(params: IConditionObject[]) {
    const thisId = params.find((item) => item.key === this.fieldId)
    const filterParams = params.filter(
      (item) => !this.ignoreFields.includes(item.key) && item.key !== this.modifiedField
    )
    if (thisId) {
      const condition = {
        key: thisId.key,
        value: String(thisId.value),
      }
      const query = `UPDATE ${this.table} ${generateUpdate(
        filterParams,
        this.clazz,
        this.modifiedField
      )} ${generateConditionWhere(this.clazz, this.fieldId, [condition])}`
      this.logger.warn(query)
      await executeQuery<T>(query)
    } else {
      filterParams.push({ key: this.fieldId, value: randomUUID() })
      const query = `INSERT INTO ${this.table} ${generateInsert(filterParams, this.clazz)}`
      this.logger.warn(query)
      await executeQuery<T>(query)
    }
  }

  async deleteEntity(params: IConditionObject[]) {
    const query = `DELETE FROM ${this.table} ${generateConditionWhere(
      this.clazz,
      this.fieldId,
      params
    )}`
    this.logger.warn(query)
    await executeQuery<T>(query)
  }
}
