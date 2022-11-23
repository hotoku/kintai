import DataLoader from "dataloader";
import { getPool } from "../../db/db";
import { ClientRecord, DealRecord, WorkHourRecord } from "./recordTypes";

async function query<T>(sql: string): Promise<T[]> {
  // sqlのselect結果の列名/型とTが整合してないと実行時エラーになる
  const db = getPool();
  const [rows, _] = await db.query(sql);
  return rows as T[];
}

function createClientLoader(): DataLoader<number, ClientRecord> {
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
      const ret = rows.find((row) => row.id === id);
      return ret || new Error(`No Client of id ${id}`);
    });
  });
}

function createDealLoader(): DataLoader<number, DealRecord> {
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
      const ret = rows.find((row) => row.id === id);
      return ret || new Error(`No Deal of id ${id}`);
    });
  });
}

function createClientDealsLoader(): DataLoader<number, number[]> {
  return new DataLoader<number, number[]>(async (ids) => {
    const rows = await query<{ clientId: number; dealId: number }>(`
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
    `);

    const map = new Map<number, number[]>();
    for (const row of rows) {
      const ar = map.get(row.clientId);
      if (ar) {
        ar.push(row.dealId);
      } else {
        map.set(row.clientId, [row.dealId]);
      }
    }
    return ids.map((id) => {
      return map.get(id) || [];
    });
  });
}

function createDealWorkHoursLoader(): DataLoader<number, number[]> {
  return new DataLoader<number, number[]>(async (ids) => {
    const rows = await query<{ dealId: number; workHourId: number }>(`
      select
        d.id as dealId,
        w.id as workHourId
      from
        Deals d
          left join
        WorkHours w
          on d.id = w.dealId
      where
        d.id in (${ids.join(",")})
    `);

    const map = new Map<number, number[]>();
    for (const row of rows) {
      const ar = map.get(row.dealId);
      if (ar) {
        ar.push(row.workHourId);
      } else {
        map.set(row.dealId, [row.workHourId]);
      }
    }
    return ids.map((id) => {
      return map.get(id) || [];
    });
  });
}

function createWorkHourLoader(): DataLoader<number, WorkHourRecord> {
  return new DataLoader<number, WorkHourRecord>(async (ids) => {
    const rows = await query<WorkHourRecord>(`
      select
        id,
        startTime,
        endTime,
        dealId,
        isDeleted,
        note
      from
        Workhours
      where
        id in (${ids.join(",")})
    `);

    return ids.map((id) => {
      const ret = rows.find((row) => row.id === id);
      return ret || new Error(`No WorkHour of id ${id}`);
    });
  });
}

export type MyDataLoader = {
  clientLoader: DataLoader<number, ClientRecord>;
  clientDealsLoader: DataLoader<number, number[]>;
  dealLoader: DataLoader<number, DealRecord>;
  dealWorkHoursLoader: DataLoader<number, number[]>;
  workHourLoader: DataLoader<number, WorkHourRecord>;
};

export default function createDataLoaders(): MyDataLoader {
  return {
    clientLoader: createClientLoader(),
    clientDealsLoader: createClientDealsLoader(),
    dealLoader: createDealLoader(),
    dealWorkHoursLoader: createDealWorkHoursLoader(),
    workHourLoader: createWorkHourLoader(),
  };
}
