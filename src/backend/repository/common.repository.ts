import { camelToSnake, snakeToCamel } from '@/src/libs'
import { IConditionObject } from '@/src/shared'
import mysql from 'mysql2/promise'
import { RepositoryException } from '../exception/repository.exception'
import { convertToDateTimeSql, isValidDate } from './../inventory/common.inventory'

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
    throw new RepositoryException(error.message)
  }
}

/*


  mapper record (from data base) to entity
  author: @ericchentch
*/
export const rowMapper = (source: any): any => {
  let result = {}
  Object.keys(source).forEach((key) => {
    result = { ...result, [snakeToCamel(key)]: source[key] }
  })
  return result
}

/*


  generate conditions for query
  author: @ericchentch
*/
const generateConditionWhere = (clazz: object, fieldId: string, params?: IConditionObject[]) => {
  if (!params) {
    return ''
  }
  let condition = ''
  let isWhere = true
  for (let i = 0; i < params.length; i++) {
    let isAnd = false
    const values = params[i].value.split(',')
    const fieldCamel = camelToSnake(params[i].key)
    for (let j = 0; j < values.length; j++) {
      let isOr = false
      if (params[i].key === fieldId && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${fieldCamel}='${values[j]}' `
      } else if (isValidDate(clazz[params[i].key as keyof typeof clazz]) && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${fieldCamel}='${convertToDateTimeSql(new Date(values[j]))}' `
      } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'number' && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${fieldCamel}=${Number(values[j])} `
      } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'boolean' && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${fieldCamel}=${Boolean(values[j]) === true ? 1 : 0} `
      } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'string' && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${fieldCamel} LIKE '%${values[j]}%' `
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
  
  generate insert for query
  author: @ericchentch
*/
const generateInsert = (params: IConditionObject[], clazz: object) => {
  let insertQuery = ' ('
  for (let i = 0; i < params.length; i++) {
    insertQuery += `${camelToSnake(params[i].key)}`
    if (i !== params.length - 1) {
      insertQuery += ','
    }
  }
  insertQuery += ') VALUES ('
  for (let i = 0; i < params.length; i++) {
    if (typeof clazz[params[i].key as keyof typeof clazz] === 'number') {
      insertQuery += `${params[i].value}`
    } else if (isValidDate(clazz[params[i].key as keyof typeof clazz])) {
      insertQuery += `'${convertToDateTimeSql(new Date(params[i].value))}'`
    } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'boolean') {
      insertQuery += `${params[i].value}`
    } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'string') {
      insertQuery += `'${params[i].value}'`
    }
    if (i !== params.length - 1) {
      insertQuery += ','
    }
  }
  insertQuery += ')'
  return insertQuery
}

/*
  
  generate update for query
  author: @ericchentch
*/

const generateUpdate = (params: IConditionObject[], clazz: object, modifiedField: string) => {
  let insertQuery = ' SET '
  for (let i = 0; i < params.length; i++) {
    const fieldName = camelToSnake(params[i].key)
    if (typeof clazz[params[i].key as keyof typeof clazz] === 'string') {
      insertQuery += `${fieldName}='${params[i].value}',`
    } else if (isValidDate(clazz[params[i].key as keyof typeof clazz])) {
      insertQuery += `${fieldName}='${convertToDateTimeSql(new Date(params[i].value))}',`
    } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'number') {
      insertQuery += `${fieldName}=${params[i].value},`
    } else if (typeof clazz[params[i].key as keyof typeof clazz] === 'boolean') {
      insertQuery += `${fieldName}=${params[i].value},`
    }
  }
  return `${insertQuery}${modifiedField}=NOW()`
}

export { emptyOrRows, executeQuery, generateConditionWhere, generateInsert, generateUpdate }
