/**
 * DBへのクエリの検証に使う
 */

import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  user: process.env.MYSQL_USER_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.MYSQL_USER_PASSWORD,
};

async function main() {
  const con = await mysql.createConnection(DB_CONFIG);
  const [rows, _] = await con.query(
    `
    select
      id,
      name
    from
      clients
    where
      id in (?)`,
    [[1, 2]]
  );
  console.log(rows);
  await con.end();
  return;
}

main();
