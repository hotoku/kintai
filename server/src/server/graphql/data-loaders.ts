import DataLoader from "dataloader";
import { getPool } from "../../db/db";
import { ClientRecord, DealRecord } from "./record-types";

export function createClientLoader(): DataLoader<number, ClientRecord> {
  return new DataLoader<number, ClientRecord>(async (ids) => {
    const db = getPool();
    const [rows, _] = await db.query(`
      select
        id,
        name
      from
        Clients
      where
        id in (${ids.join(",")})
    `);

    // todo: クエリの結果に型を付ける方法を調べる
    return rows as ClientRecord[];
  });
}

export function createDealLoader(): DataLoader<number, DealRecord> {
  return new DataLoader<number, DealRecord>(async (ids) => {
    const db = getPool();
    const [rows, _] = await db.query(`
      select
        id,
        name,
        clientId
      from
        Deals
      where
        id in (${ids.join(",")})
    `);

    return rows as DealRecord[];
  });
}

export type MyDataLoader = {
  clientLoader: DataLoader<number, ClientRecord>;
  dealLoader: DataLoader<number, DealRecord>;
};
