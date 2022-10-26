import { Client, Deal, WorkHour } from "../api/types";

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
