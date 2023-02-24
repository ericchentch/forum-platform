import { IConditionObject } from '@/src/shared'
import mysql from 'mysql2/promise'
import { RepositoryException } from '../exception/repository.exception'
import { isBoolean, isNumber, isValidDate } from './../inventory/common.inventory'

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
const generateConditionWhere = (params?: IConditionObject[]) => {
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
      if ((typeof params[i].value === 'string' || isValidDate(params[i].value)) && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}='${values[j]}' `
      }
      if (isNumber(params[i].value) && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}=${Number(values[j])} `
      }
      if (isBoolean(params[i].value) && !isOr) {
        if (isWhere) {
          condition += ' WHERE '
          isWhere = false
          isOr = true
        }
        condition += ` ${params[i].key}=${Boolean(values[j]) === true ? 1 : 0} `
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
const generateInsert = (params: IConditionObject[]) => {
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
    if (typeof params[i].value === 'string' && !skip) {
      insertQuery += `'${params[i].value}'`
      skip = true
    }
    if (isNumber(params[i].value) && !skip) {
      insertQuery += `${params[i].value}`
      skip = true
    }
    if (isBoolean(params[i].value) && !skip) {
      insertQuery += `${params[i].value}`
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

const generateUpdate = (params: IConditionObject[]) => {
  let insertQuery = ' SET '
  for (let i = 0; i < params.length; i++) {
    let skip = false
    if (typeof params[i].value === 'string' && !skip) {
      insertQuery += `${params[i].key}='${params[i].value}',`
      skip = true
    }
    if (isNumber(params[i].value) && !skip) {
      insertQuery += `${params[i].key}=${params[i].value},`
      skip = true
    }
    if (isBoolean(params[i].value) && !skip) {
      insertQuery += `${params[i].key}=${params[i].value},`
      skip = true
    }
  }
  return `${insertQuery}modified=NOW()`
}

export { emptyOrRows, executeQuery, generateConditionWhere, generateInsert, generateUpdate }
