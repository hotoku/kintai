import express, { Application } from "express";
import { getPool } from "../db/db";
import { WorkHour, Client, Deal } from "../db/types";

const TRUE = 1;
const FALSE = 0;

export const deals = (app: Application): Application => {
  app.get("/api/deals", async (_, res) => {
    const db = getPool();
    const [rows, _2] = await db.query(`
select
  l.id,
  l.name,
  l.clientId,
  r.name as clientName
from
  deals l inner join
  clients r on (l.clientId = r.id)
    `);
    res.send(rows);
  });

  app.put("/api/deals", async (req, res) => {
    const db = getPool();
    const obj = req.body as Deal;
    await db.query(
      `
update Deals
set
  name = ?,
  clientId = ?
where
  id=?      
`,
      [obj.name, obj.clientId, obj.id]
    );
    res.send("ok");
  });

  app.post("/api/deals", async (req, res) => {
    const db = getPool();
    const obj = req.body as Deal;
    await db.query(
      `
insert into Deals (name, clientId)
values (?, ?)      
`,
      [obj.name, obj.clientId]
    );
    res.send("ok");
  });

  return app;
};

export const clients = (app: Application): Application => {
  app.get("/api/clients", async (_, res) => {
    const db = getPool();
    const [ret, _2] = await db.query(`
select
  id,
  name
from
  clients 
`);
    res.send(ret);
  });

  app.put("/api/clients", async (req, res) => {
    const db = getPool();
    const obj = req.body as Client;
    await db.query(
      `
update Clients
set
  name = ?
where
  id=?
`,
      [obj.name, obj.id]
    );
    res.send("ok");
  });

  app.post("/api/clients", async (req, res) => {
    const db = getPool();
    const obj = req.body as Client;
    await db.query(
      `
insert into Clients (
  name
)
values (
  ?
)
      `,
      obj.name
    );
    res.send("ok");
  });

  return app;
};

export const workHours = (app: Application): Application => {
  app.get("/api/workHours", async (req, res) => {
    const db = getPool();
    const dealId = (req.query as any).dealId; // todo: reqの型付け調べる
    const deleted = (req.query as any).deleted !== undefined;
    const [ret, _] = await db.query(
      `
      select
        id,
        dealId,
        startTime,
        endTime
      from
        workHours
      where
        dealId=${dealId} and
        isDeleted = ?
      `,
      deleted
    );
    res.send(ret);
  });

  app.post("/api/workHours", async (req, res) => {
    const db = getPool();
    const obj = req.body as WorkHour;
    await db.query(
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
      [obj.dealId, obj.startTime, obj.endTime]
    );
    res.send("ok");
  });

  app.put("/api/workHours", async (req, res) => {
    const db = getPool();
    const obj = req.body as WorkHour;
    await db.query(
      `
      update workHours
      set
        dealId = ?,
        startTime = ?,
        endTime = ?,
        isDeleted = ?
      where
        id=?
      `,
      [
        obj.dealId,
        obj.startTime,
        obj.endTime,
        obj.isDeleted ? TRUE : FALSE,
        obj.id,
      ]
    );
    res.send("ok");
  });

  app.delete("/api/workHours", async (req, res) => {
    const db = getPool();
    const obj = req.body as WorkHour;
    await db.query(
      `
      delete from WorkHours
      where
        id = ?
      `,
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
