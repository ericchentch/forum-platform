import { IConditionObject } from '@/src/shared'
import { executeQuery, generateConditionWhere } from './common.repository'

export class BaseRepository<T> {
  table: string = ''

  async findAll(params: IConditionObject[]) {
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere({ params })}`
    const result = await executeQuery<T>(query)
    return result
  }

  async findOne(field: string, value: any) {
    const params = [{ key: field, value }]
    const query = `SELECT * FROM ${this.table} ${generateConditionWhere({ params })}`
    const result = await executeQuery<T>(query)
    if (result.length > 0) {
      return result[0]
    } else return null
  }
}
