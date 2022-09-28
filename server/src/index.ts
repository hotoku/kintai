import express from "express";

import { getInstance } from "./db/db";

const start = () => {
  const app = express();
  app.use("/api/deals", () => {
    const db = getInstance();
    db.open();
    const ret = db.get(`
select
  id,
  name
from
  deals
`);
    console.log(ret);
  });

  app.listen(8080);
};

start();
