import * as mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  user: process.env.MYSQL_USER_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.MYSQL_USER_PASSWORD,
};

export const getConnection = async (): Promise<mysql.Connection> => {
  return await mysql.createConnection(DB_CONFIG);
};

export const getPool = (): mysql.Pool => {
  const pool = mysql.createPool({
    ...DB_CONFIG,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool;
};
