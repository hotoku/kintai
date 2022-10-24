import * as fs from "fs";
import * as mysql from "mysql2/promise";
import { getInstance, getPool } from "./db";

const makeLoader = (
  sql: string,
  path: string,
  names: string[]
): ((db: mysql.Connection) => Promise<void>) => {
  const ret = async (db: mysql.Connection) => {
    const contents = fs.readFileSync(path).toString();
    const objs = JSON.parse(contents) as any[];
    for (const obj of objs) {
      await db.query(
        sql,
        names.map((n) => obj[n])
      );
    }
  };
  return ret;
};

const join = (ss: string[]): string => {
  const n = ss.length;
  let ret = "";
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      ret += ",";
    }
    ret += ss[i];
  }
  return ret;
};

const move = async (db: mysql.Pool, cols: string[], table: string) => {
  const sql1 = `
    select ${join(cols)}    
    from ${table}
  `;
  const obj = await getInstance();
  const data = await obj.all(sql1);
  const sql2 = `
    insert into ${table} (${join(cols)})
    values (${join(cols.map((_) => "?"))})
  `;

  for (let i = 0; i < data.length; i++) {
    await db.query(
      sql2,
      cols.map((n) => data[i][n])
    );
  }
};

const run = async () => {
  const db = getPool();
  await move(db, ["id", "name"], "Clients");
  await move(db, ["id", "name", "clientId"], "Deals");
  await move(
    db,
    ["id", "startTime", "endTime", "isDeleted", "dealId"],
    "WorkHours"
  );
  db.end();
};

run();
