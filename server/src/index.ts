import express from "express";

import { getInstance } from "./db/db";

const start = () => {
  const app = express();
  app.use("/api/deals", async (_, res) => {
    const db = getInstance();
    db.open();
    const ret = await db.all(`
select
  id,
  name
from
  deals
`);
    res.send(ret);
  });
  app.use("/api/work_hours", async (req, res) => {
    const db = getInstance();
    db.open();
    const deal_id = (req.query as any).deal_id;
    const ret = await db.all(`
select
  id,
  deal_id,
  start_time,
  end_time
from
  work_hours
where
  deal_id=${deal_id}
`);
    res.send(ret);
  });

  app.listen(8080);
};

start();
