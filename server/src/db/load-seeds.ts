import * as fs from "fs";
import * as mysql from "mysql2/promise";
import { getConnection } from "./db";

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
  `${process.cwd()}/seeds/deals.json`,
  ["id", "name", "clientId"]
);

const queryForWorkHours = `
insert into workHours
(
  id,
  dealId,
  startTime,
  endTime
)
values
(
  ?, ?, ?, ?
)
`;
const loadWorkHours = makeLoader(
  queryForWorkHours,
  `${process.cwd()}/seeds/work_hours.json`,
  ["id", "dealId", "startTime", "endTime"]
);

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
  `${process.cwd()}/seeds/clients.json`,
  ["id", "name"]
);

const run = async () => {
  const db = await getConnection();
  await loadClients(db);
  await loadDeals(db);
  await loadWorkHours(db);
  db.end();
};

run();
