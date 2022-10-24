import * as fs from "fs";
import * as mysql from "mysql2/promise";
import { getConnection, getInstance } from "./db";

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

const moveClients = async (cols: string[], table: string) => {
  const sql1 = `
    select ${join(cols)}    
    from ${table}
  `;
  console.log(sql1);
  const obj = await getInstance();
  const data = await obj.run(sql1);
  console.log(data);
};

const run = async () => {
  await moveClients(["id", "name"], "Clients");
};

run();
