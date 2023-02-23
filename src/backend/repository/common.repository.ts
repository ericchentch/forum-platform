import mysql from 'mysql2/promise'

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

const executeQuery = async (sql: string) => {
  try {
    const connection = await mysql.createConnection(config)
    const [results] = await connection.execute(sql)
    return emptyOrRows(results) as any
  } catch (error: any) {
    console.error(error.message)
    return [] as any
  }
}

export { emptyOrRows, executeQuery }
