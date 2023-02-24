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

const generateConditionWhere = ({ params }: IGenerateWhere) => {
  let condition = ''
  if (params.length > 0) {
    condition += ' WHERE '
  }
  for (let i = 0; i < params.length; i++) {
    for (let j = 0; j < params[i].value.length; j++) {
      if (typeof params[i].value[j] === 'number' || typeof params[i].value[j] === 'boolean') {
        condition += ` ${params[i].key}=${typeof params[i].value[j]} `
      }
      if (typeof params[i].value[j] === 'string' || typeof params[i].value[j] === typeof Date) {
        condition += ` ${params[i].key}='${typeof params[i].value[j]}' `
      }
      if (j !== params[i].value.length - 1) {
        condition += ' OR '
      }
    }
    if (i !== params.length - 1) {
      condition += ' AND '
    }
  }
  return condition
}

/*
  
*/

export { emptyOrRows, executeQuery, generateConditionWhere }
