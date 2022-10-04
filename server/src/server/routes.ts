import express, { Application } from "express";
import { getInstance } from "../db/db";
import { WorkHour, Client } from "../db/types";

export const deals = (app: Application): Application => {
  app.get("/api/deals", async (_, res) => {
    const db = getInstance();
    await db.open();
    const ret = await db.all(`
select
  l.id,
  l.name,
  l.clientId,
  r.name as clientName
from
  deals l inner join
  clients r on (l.clientId = r.id)
`);
    res.send(ret);
  });
  return app;
};

export const clients = (app: Application): Application => {
  app.get("/api/clients", async (_, res) => {
    const db = getInstance();
    await db.open();
    const ret = await db.all(`
select
  id,
  name
from
  clients 
`);
    res.send(ret);
  });

  app.put("/api/clients", async (req, res) => {
    const db = getInstance();
    await db.open();
    const obj = req.body as Client;
    await db.run(
      `
update Clients
set
  name = ?
where
  id=?
`,
      obj.name,
      obj.id
    );
    res.send("ok");
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

export const staticFiles = (app: Application): Application => {
  const publicDir = process.cwd() + "/../client/build";
  app.use("/", express.static(publicDir));
  return app;
};
