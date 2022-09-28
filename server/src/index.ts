import express from "express";

import { getInstance } from "./db/db";

const start = () => {
  const app = express();
  app.get("/api/deals", async (_, res) => {
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
  app.get("/api/workHours", async (req, res) => {
    const db = getInstance();
    db.open();
    const dealId = (req.query as any).dealId; // todo: reqの型付け調べる
    const ret = await db.all(`
select
  id,
  dealId,
  startTime,
  endTime
from
  workHours
where
  dealId=${dealId}
`);
    res.send(ret);
  });

  app.listen(8080);
};

start();
