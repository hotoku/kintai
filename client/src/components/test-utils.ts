import { Client, Deal, WorkHour } from "../api/types";
import { invalidDate } from "../share/utils";

export const makeObject = (
  data: any[],
  names: string[]
): { [type: string]: any } => {
  const ret: { [type: string]: any } = {};
  for (let i = 0; i < names.length; i++) {
    ret[names[i]] = data[i];
  }
  return ret;
};

export type WorkHourSeed = [number, number, Date, Date?, boolean?, string?];
export const makeWorkHour = (data: WorkHourSeed): WorkHour => {
  return makeObject(data, [
    "id",
    "dealId",
    "startTime",
    "endTime",
    "isDeleted",
    "note",
  ]) as WorkHour;
};

export type DealSeed = [number, number];
export const makeDeal = (data: DealSeed): Deal => {
  return makeObject(
    [data[0], `deal ${data[0]}`, data[1], `client ${data[1]}`],
    ["id", "name", "clientId", "clientName"]
  ) as Deal;
};

export const makeClient = (id: number): Client => {
  return makeObject([id], ["id"]) as Client;
};

export type WorkHourRecord = Omit<WorkHour, "startTime" | "endTime"> & {
  startTime: string;
  endTime?: string;
};

export function rec2obj(obj: WorkHourRecord): WorkHour {
  const endTime = obj.endTime ? new Date(obj.endTime) : undefined;
  const endTime2 = endTime && !invalidDate(endTime) ? endTime : undefined;
  return {
    ...obj,
    startTime: new Date(obj.startTime),
    endTime: endTime2,
  };
}
