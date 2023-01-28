import { Deal, WorkHour } from "../../api/types";
import { formatDateTime } from "../../share/utils";
import { rec2obj, WorkHourRecord } from "../test-utils";
import { throwQuery } from "../utils";

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
  const [objs, errors] = await throwQuery<WorkHourRecord[]>(query);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
  return objs.map(rec2obj);
}

export async function updateWorkHour(wh: WorkHour): Promise<WorkHour> {
  const startTime = formatDateTime(wh.startTime);
  const endTime = wh.endTime ? formatDateTime(wh.endTime) : "NULL";
  const query = `
    mutation {
      object: updateWorkHour(
        id: ${wh.id},
        startTime: "${startTime}",
        endTime: "${endTime}",
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
  const [obj, errors] = await throwQuery<WorkHourRecord>(query);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
  return rec2obj(obj);
}

export async function addWorkHour(wh: Omit<WorkHour, "id">): Promise<WorkHour> {
  const startTime = formatDateTime(wh.startTime);
  const endTime = wh.endTime ? formatDateTime(wh.endTime) : "NULL";

  const query = `
    mutation {
      object: addWorkHour(
        startTime: "${startTime}",
        endTime:"${endTime}",
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
  const [obj, errors] = await throwQuery<WorkHourRecord>(query);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
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
  const [obj, errors] = await throwQuery<PartialDeal>(query);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
  return obj;
}
