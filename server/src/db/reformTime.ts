import { readFileSync } from "fs";
import * as mysql from "mysql2/promise";
import { getConnection } from "./db";

type Object = { [key: string]: string };

function readCsv(path: string): (Object | undefined)[] {
  const lines = readFileSync(path).toString().split("\n");
  const header = lines[0].split(",");
  const makeObj = (s: string) => {
    const ret = {} as Object;
    const items = s.split(",");
    if (header.length !== items.length) {
      return undefined;
    }
    header.map((v, i) => {
      ret[v] = items[i];
    });
    return ret;
  };
  return lines.slice(1).map(makeObj);
}

function makeLoader(
  sql: string,
  path: string,
  parser: (o: Object) => any[]
): (db: mysql.Connection) => Promise<void> {
  const ret = async (db: mysql.Connection) => {
    const objs = readCsv(path);
    for (const obj of objs) {
      if (obj) {
        await db.query(sql, parser(obj));
      }
    }
  };
  return ret;
}

const queryForClients = `
insert into clients
(
  id,
  name 
)
  values
(
  ?,
  ?
)
`;
const loadClients = makeLoader(
  queryForClients,
  `${process.cwd()}/seeds/clients.csv`,
  (o: Object) => {
    return [parseInt(o["id"]), o["name"]];
  }
);

const queryForDeals = `
insert into deals
(
  id,
  name,
  clientId
)
values
(
  ?, ?, ?
)
`;
const loadDeals = makeLoader(
  queryForDeals,
  `${process.cwd()}/seeds/deals.csv`,
  (o: Object) => {
    return [parseInt(o["id"]), o["name"], parseInt(o["clientId"])];
  }
);

const queryForWorkHours = `
insert into workHours
(
  id,
  dealId,
  startTime,
  endTime,
  isDeleted,
  note
)
values
(
  ?, ?, ?, ?, ?, ?
)
`;
const loadWorkHours = makeLoader(
  queryForWorkHours,
  `${process.cwd()}/seeds/workHours.csv`,
  (o: Object) => {
    return [
      parseInt(o["id"]),
      parseInt(o["dealId"]),
      o["startTime"],
      o["endTime"],
      o["isDeleted"] !== "0",
      o["note"],
    ];
  }
);

const run = async () => {
  const db = await getConnection();
  await loadClients(db);
  await loadDeals(db);
  await loadWorkHours(db);
  db.end();
};

run();
