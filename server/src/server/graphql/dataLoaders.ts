import DataLoader from "dataloader";
import { getConnection } from "../../db/db";
import {
  ClientRecord,
  DaySummaryRecord,
  DealRecord,
  WorkHourRecord,
} from "./recordTypes";

async function query<T>(sql: string, params?: readonly any[]): Promise<T[]> {
  // sqlのselect結果の列名/型とTが整合してないと実行時エラーになる
  // todo: zodを使えば実行時のチェックもできる
  const db = await getConnection();
  const [rows, _] = await db.query(sql, params);
  return rows as T[];
}

class ClientLoader extends DataLoader<number, ClientRecord> {
  constructor() {
    super(async (ids: readonly number[]) => {
      const rows = await query<ClientRecord>(
        `
      select
        id,
        name
      from
        clients
      where
        id in (?)
        `,
        [ids]
      );

      return ids.map((id) => {
        const ret = rows.find((row) => row.id === id);
        return ret || new Error(`No Client of id ${id}`);
      });
    });
  }

  all = async (): Promise<ClientRecord[]> => {
    const rows = await query<ClientRecord>(`
      select
        id,
        name
      from
        clients
    `);
    return rows;
  };
}

function createDealLoader(): DataLoader<number, DealRecord> {
  return new DataLoader<number, DealRecord>(async (ids) => {
    const rows = await query<DealRecord>(
      `
      select
        id,
        name,
        clientId,
        isFinished
      from
        deals
      where
        id in (?)
    `,
      [ids]
    );
    return ids.map((id) => {
      const ret = rows.find((row) => row.id === id);
      return ret || new Error(`No Deal of id ${id}`);
    });
  });
}

function createClientDealsLoader(): DataLoader<number, number[]> {
  return new DataLoader<number, number[]>(async (ids) => {
    const rows = await query<{ clientId: number; dealId: number }>(
      `
      select
        c.id as clientId,
        d.id as dealId
      from
        clients c
         inner join
        deals d
          on c.id = d.clientId
      where
        c.id in (?)
    `,
      [ids]
    );

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
    const rows = await query<{ dealId: number; workHourId: number }>(
      `
      select
        d.id as dealId,
        w.id as workHourId
      from
        deals d
          inner join
        workhours w
          on d.id = w.dealId
      where
        d.id in (?)
    `,
      [ids]
    );

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
    console.log("ids:", ids);
    const rows = await query<WorkHourRecord>(
      `
      select
        id,
        startTime,
        endTime,
        dealId,
        isDeleted,
        note
      from
        workhours
      where
        id in (?)
    `,
      [ids]
    );

    console.log("work hour ids", ids);

    return ids.map((id) => {
      const ret = rows.find((row) => row.id === id);
      return ret || new Error(`No WorkHour of id ${id}`);
    });
  });
}

function createDaySummaryLoader(): DataLoader<string, DaySummaryRecord> {
  return new DataLoader<string, DaySummaryRecord>(async (dates) => {
    const rows = await query<WorkHourRecord & { date: string }>(
      `
      select
        substr(startTime, 1, 10) as date,
        id,
        startTime,
        endTime,
        isDeleted,
        note,
        dealId
      from
        workhours
      where
        substr(startTime, 1, 10) in (?)
    `,
      [dates]
    );

    const ret = dates.map((date) => {
      return {
        date: date,
        workHours: rows.filter((row) => row.date === date),
      };
    });
    return ret;
  });
}

export type MyDataLoader = {
  clientLoader: ClientLoader; // todo: 他のメンバーと平仄を合わせる
  clientDealsLoader: DataLoader<number, number[]>;
  dealLoader: DataLoader<number, DealRecord>;
  dealWorkHoursLoader: DataLoader<number, number[]>;
  workHourLoader: DataLoader<number, WorkHourRecord>;
  daySummaryLoader: DataLoader<string, DaySummaryRecord>;
};

export default function createDataLoaders(): MyDataLoader {
  return {
    clientLoader: new ClientLoader(),
    clientDealsLoader: createClientDealsLoader(),
    dealLoader: createDealLoader(),
    dealWorkHoursLoader: createDealWorkHoursLoader(),
    workHourLoader: createWorkHourLoader(),
    daySummaryLoader: createDaySummaryLoader(),
  };
}
