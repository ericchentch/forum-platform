import { IConditionObject } from '@/src/shared'
import mysql from 'mysql2/promise'
import { RepositoryException } from '../exception/repository.exception'
import {
  convertToDateTimeSql,
  isBoolean,
  isNumber,
  isValidDate,
} from './../inventory/common.inventory'

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


  generate conditions for query
  author: @ericchentch
*/
const generateConditionWhere = (clazz: object, params?: IConditionObject[]) => {
  if (!params) {
    return ''
  }
  let condition = ''
  let isWhere = true
  for (let i = 0; i < params.length; i++) {
    let isAnd = false
    const values = params[i].value.split(',')
    for (let j = 0; j < values.length; j++) {
      let isOr = false
      if (
        (typeof clazz[params[i].key as keyof typeof clazz] === 'string' ||
          isValidDate(clazz[params[i].key as keyof typeof clazz])) &&
        !isOr
      ) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key} LIKE '%${values[j]}%' `
      }
      if (isNumber(clazz[params[i].key as keyof typeof clazz]) && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}=${Number(values[j])} `
      }
      if (isBoolean(clazz[params[i].key as keyof typeof clazz]) && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${clazz[params[i].key as keyof typeof clazz]}=${
          Boolean(values[j]) === true ? 1 : 0
        } `
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
    insertQuery += `${params[i].key}`
    if (i !== params.length - 1) {
      insertQuery += ','
    }
  }
  insertQuery += ') VALUES ('
  for (let i = 0; i < params.length; i++) {
    let skip = false
    if (typeof clazz[params[i].key as keyof typeof clazz] === 'string' && !skip) {
      insertQuery += `'${params[i].value}'`
      skip = true
    }
    if (isNumber(clazz[params[i].key as keyof typeof clazz]) && !skip) {
      insertQuery += `${params[i].value}`
      skip = true
    }
    if (isBoolean(clazz[params[i].key as keyof typeof clazz]) && !skip) {
      insertQuery += `${params[i].value}`
      skip = true
    }
    if (isValidDate(clazz[params[i].key as keyof typeof clazz]) && !skip) {
      insertQuery += `'${convertToDateTimeSql(clazz[params[i].key as keyof typeof clazz])}'`
      skip = true
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

const generateUpdate = (params: IConditionObject[], clazz: object) => {
  let insertQuery = ' SET '
  for (let i = 0; i < params.length; i++) {
    let skip = false
    if (typeof clazz[params[i].key as keyof typeof clazz] === 'string' && !skip) {
      insertQuery += `${params[i].key}='${params[i].value}',`
      skip = true
    }
    if (isNumber(clazz[params[i].key as keyof typeof clazz]) && !skip) {
      insertQuery += `${params[i].key}=${params[i].value},`
      skip = true
    }
    if (isBoolean(clazz[params[i].key as keyof typeof clazz]) && !skip) {
      insertQuery += `${params[i].key}=${params[i].value},`
      skip = true
    }
    if (isValidDate(clazz[params[i].key as keyof typeof clazz]) && !skip) {
      insertQuery += `${params[i].key}='${convertToDateTimeSql(
        clazz[params[i].key as keyof typeof clazz]
      )}',`
      skip = true
    }
  }
  return `${insertQuery}modified=NOW()`
}

export { emptyOrRows, executeQuery, generateConditionWhere, generateInsert, generateUpdate }
