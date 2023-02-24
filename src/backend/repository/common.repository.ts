import { IGenerateWhere } from '@/src/shared'
import mysql from 'mysql2/promise'
import { RepositoryException } from '../exception/repository.exception'

/*


 config for connection db and execute query
 author: @ericchentch
*/

const config = {
  host: process.env.DB_HOST || '',
  user: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE_NAME || '',
  ssl: {},
}

const emptyOrRows = (
  rows:
    | mysql.RowDataPacket[]
    | mysql.RowDataPacket[][]
    | mysql.OkPacket
    | mysql.OkPacket[]
    | mysql.ResultSetHeader
) => {
  if (!rows) {
    return []
  }
  return rows
}

const executeQuery = async <T>(sql: string) => {
  try {
    const connection = await mysql.createConnection(config)
    const [results] = await connection.execute(sql)
    return emptyOrRows(results) as T[]
  } catch (error: any) {
    console.error(error.message)
    throw new RepositoryException(error.message)
  }
}

/*


  generate conditions for query
  author: @ericchentch
*/
const generateConditionWhere = (props: IGenerateWhere) => {
  const { params, clazz } = props
  if (!params) {
    return ''
  }
  if (typeof clazz !== 'object') {
    return ''
  }
  let condition = ''
  let isWhere = true
  for (let i = 0; i < params.length; i++) {
    let isAnd = false
    const values = params[i].value.split(',')
    for (let j = 0; j < values.length; j++) {
      let isOr = false
      if (typeof clazz[params[i].key] === 'number') {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}=${Number(values[j])} `
      }
      if (typeof clazz[params[i].key] === 'boolean') {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}=${Boolean(values[j]) === true ? 1 : 0} `
      }
      if (typeof clazz[params[i].key] === 'string' || typeof clazz[params[i].key] === typeof Date) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}='${values[j]}' `
      }
      if (j !== values.length - 1 && isOr) {
        condition += ' OR '
      }
      if (isOr) {
        isAnd = true
      }
    }
    if (i !== params.length - 1 && isAnd) {
      condition += ' AND '
    }
  }
  return condition
}

/*
  
*/

export { emptyOrRows, executeQuery, generateConditionWhere }
