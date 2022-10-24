import * as mysql from "mysql2/promise";

import { Database } from "sqlite";
import { Database as Driver } from "sqlite3";
import { sync_data_path } from "../utils";

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

export const getInstance = async (): Promise<Database> => {
  const db_dir = `${sync_data_path()}/db`;
  const db_path = db_dir + `/db.sqlite`;
  const db = new Database({
    filename: db_path,
    driver: Driver,
  });
  await db.open();
  await db.run("PRAGMA foreign_keys = ON");
  return db;
};
