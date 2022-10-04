import * as fs from "fs";
import { getInstance } from "./db";

const makeLoader = (
  sql: string,
  path: string,
  names: string[]
): (() => Promise<void>) => {
  const ret = async () => {
    const contents = fs.readFileSync(path).toString();
    const objs = JSON.parse(contents) as any[];
    const db = getInstance();
    db.open();
    for (const obj of objs) {
      await db.run(sql, ...names.map((n) => obj[n]));
    }
  };
  return ret;
};

const queryForDeals = `
insert into deals
(
  name,
  clientId
)
values
(
  ?, ?
)
`;
const loadDeals = makeLoader(
  queryForDeals,
  `${process.cwd()}/seeds/deals.json`,
  ["name", "clientId"]
);

const queryForWorkHours = `
insert into workHours
(
  dealId,
  startTime,
  endTime
)
values
(
  ?, ?, ?
)
`;
const loadWorkHours = makeLoader(
  queryForWorkHours,
  `${process.cwd()}/seeds/work_hours.json`,
  ["dealId", "startTime", "endTime"]
);

const queryForClients = `
insert into clients
(
  name 
)
  values
(
  ?
)
`;
const loadClients = makeLoader(
  queryForClients,
  `${process.cwd()}/seeds/clients.json`,
  ["name"]
);

const run = async () => {
  await loadClients();
  await loadDeals();
  await loadWorkHours();
};

run();
