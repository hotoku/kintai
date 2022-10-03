import { Application } from "express";
import { type } from "os";
import { getInstance } from "../db/db";
import { WorkHour } from "../db/types";

export const deals = (app: Application): Application => {
  app.get("/api/deals", async (_, res) => {
    const db = getInstance();
    await db.open();
    const ret = await db.all(`
select
  id,
  name
from
  deals
`);
    res.send(ret);
  });
  return app;
};

export const workHours = (app: Application): Application => {
  app.get("/api/workHours", async (req, res) => {
    const db = getInstance();
    await db.open();
    const dealId = (req.query as any).dealId; // todo: reqの型付け調べる
    const ret = await db.all(
      `
      select
        id,
        dealId,
        startTime,
        endTime
      from
        workHours
      where
        dealId=${dealId}
      `
    );
    res.send(ret);
  });

  app.post("/api/workHours", async (req, res) => {
    const db = getInstance();
    await db.open();
    const obj = req.body as WorkHour;
    await db.run(
      `
      insert into workHours (
        dealId,
        startTime,
        endTime)
      values (
        ?,
        ?,
        ?
      )
      `,
      obj.dealId,
      obj.startTime,
      obj.endTime
    );
    res.send("ok");
  });

  app.put("/api/workHours", async (req, res) => {
    const db = getInstance();
    await db.open();
    const obj = req.body as WorkHour;
    await db.run(
      `
      update workHours
      set
        dealId = ?,
        startTime = ?,
        endTime = ?
      where
        id=?
      `,
      obj.dealId,
      obj.startTime,
      obj.endTime,
      obj.id
    );
    res.send("ok");
  });

  return app;
};
