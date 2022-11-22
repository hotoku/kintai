import DataLoader from "dataloader";
import { getPool } from "../../db/db";
import { ClientRecord, DealRecord } from "./record-types";

async function query<T>(sql: string): Promise<T[]> {
  // sqlのselect結果の列名/型とTが整合してないと実行時エラーになる
  const db = getPool();
  const [rows, _] = await db.query(sql);
  return rows as T[];
}

export function createClientLoader(): DataLoader<number, ClientRecord> {
  return new DataLoader<number, ClientRecord>(async (ids) => {
    const rows = await query<ClientRecord>(`
      select
        id,
        name
      from
        Clients
      where
        id in (${ids.join(",")})
    `);

    return ids.map((id) => {
      const ret = rows.find((row) => row.id == id);
      return ret || new Error(`No Client of id ${id}`);
    });
  });
}

export function createDealLoader(): DataLoader<number, DealRecord> {
  return new DataLoader<number, DealRecord>(async (ids) => {
    const rows = await query<DealRecord>(`
      select
        id,
        name,
        clientId
      from
        Deals
      where
        id in (${ids.join(",")})
    `);

    return ids.map((id) => {
      const ret = rows.find((row) => row.id == id);
      return ret || new Error(`No Deal of id ${id}`);
    });
  });
}

export function createClientDealsLoader(): DataLoader<number, number[]> {
  return new DataLoader<number, number[]>(async (ids) => {
    const db = getPool();
    const rows = (
      await db.query(`
      select
        c.id as clientId,
        d.id as dealId
      from
        Clients c
          left join
        Deals d
          on c.id = d.clientId
      where
        c.id in (${ids.join(",")})
    `)
    )[0] as { clientId: number; dealId: number }[];

    const map = new Map<number, number[]>();
    for (const row of rows) {
      const ar = map.get(row.clientId);
      if (ar) {
        map.set(row.clientId, ar);
      } else {
        map.set(row.clientId, [row.dealId]);
      }
    }
    return ids.map((id) => {
      const ret = map.get(id);
      return ret || [];
    });
  });
}

export type MyDataLoader = {
  clientLoader: DataLoader<number, ClientRecord>;
  clientDealsLoader: DataLoader<number, number[]>;
  dealLoader: DataLoader<number, DealRecord>;
};
