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

  app.listen(8080);
};

start();
