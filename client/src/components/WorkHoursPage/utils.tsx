import { Deal, WorkHour } from "../../api/types";

export async function throwQuery<T>(query: string, name?: string): Promise<T> {
  name = name || "object";
  const ret = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  return (await ret.json()).data[name] as T;
}

export type WorkHourRecord = Omit<WorkHour, "startTime" | "endTime"> & {
  startTime: string;
  endTime?: string;
};

export function rec2obj(obj: WorkHourRecord): WorkHour {
  return {
    ...obj,
    startTime: new Date(obj.startTime),
    endTime: obj.endTime ? new Date(obj.endTime) : undefined,
  };
}

export async function loadWorkHours(dealId: number): Promise<WorkHour[]> {
  const query = `
        query {
          object: getWorkHoursOfDeal(dealId: ${dealId}) {
            id
            dealId
            startTime
            endTime
            isDeleted
            note
          }
        }
  `;
  const objs = await throwQuery<WorkHourRecord[]>(query);
  return objs.map(rec2obj);
}

export async function updateWorkHour(wh: WorkHour): Promise<WorkHour> {
  const query = `
    mutation {
      object: updateWorkHour(
        id: ${wh.id},
        startTime: "${wh.startTime}",
         endTime:"${wh.endTime ? wh.endTime : "NULL"}",
        isDeleted: ${wh.isDeleted},
        note: "${wh.note}"
      ) {
        id
        startTime
        endTime
        dealId
        isDeleted
        note
      }
    }
  `;
  const obj = await throwQuery<WorkHourRecord>(query);
  return rec2obj(obj);
}

export async function addWorkHour(wh: Omit<WorkHour, "id">): Promise<WorkHour> {
  const query = `
    mutation {
      object: addWorkHour(
        startTime: "${wh.startTime}",
        endTime:"${wh.endTime ? wh.endTime : "NULL"}",
        dealId: ${wh.dealId},
        note: "${wh.note ? wh.note : ""}"
      ) {
        id
        startTime
        endTime
        dealId
        isDeleted
        note
      }
    }
  `;
  const obj = await throwQuery<WorkHourRecord>(query);
  return rec2obj(obj);
}

export type PartialDeal = Pick<Deal, "id" | "name">;
export async function loadDeal(dealId: number): Promise<PartialDeal> {
  const query = `
        query {
          object: getDeal(id: ${dealId}) {
            id
            name
          }
        }
  `;
  const obj = await throwQuery<PartialDeal>(query);
  return obj;
}
