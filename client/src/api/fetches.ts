import { formatDateTime } from "../share/utils";
import {
  Deal,
  HalfwayWorkHour,
  WorkHour,
  Client,
  HalfwayClient,
} from "./types";

export const fetchDeals = async (): Promise<Deal[]> => {
  const res = await fetch("/api/deals");
  const data = (await res.json()) as Deal[];
  return data;
};

export const putDeal = (obj: {
  id: number;
  name: string;
  clientId: number;
}): Promise<Response> => {
  const method = "PUT";
  const body = JSON.stringify(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/deals", { method, headers, body });
};

export const postDeal = (obj: Partial<Deal>): Promise<Response> => {
  const method = "POST";
  const body = JSON.stringify({ ...obj, isFinished: obj.isFinished ?? false });
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/deals", { method, headers, body });
};

export const fetchClients = async (): Promise<Client[]> => {
  const res = await fetch("/api/clients");
  const data = (await res.json()) as Client[];
  return data;
};

export const fetchWorkHours = async (
  dealId: number,
  deleted?: boolean
): Promise<WorkHour[]> => {
  const url = `/api/workHours?dealId=${dealId}` + (deleted ? "&deleted" : "");
  const res = await fetch(url);
  const data = await res.json();
  const ret: WorkHour[] = data.map((x: any) => {
    return {
      id: x["id"],
      dealId: x["dealId"],
      startTime: new Date(x["startTime"]),
      endTime: x["endTime"] ? new Date(x["endTime"]) : undefined,
      note: x["note"],
    };
  });
  return ret;
};

const halfwayWorkHourToJson = (obj: HalfwayWorkHour): string => {
  return toJson(obj, (obj: HalfwayWorkHour): any => {
    return {
      ...obj,
      startTime: obj.startTime
        ? formatDateTime(obj.startTime, false)
        : undefined,
      endTime: obj.endTime ? formatDateTime(obj.endTime, false) : undefined,
    };
  });
};

const workHourToJson = (obj: WorkHour): string => {
  return toJson(obj, (obj: WorkHour): any => {
    return {
      ...obj,
      startTime: formatDateTime(obj.startTime, false),
      endTime: obj.endTime ? formatDateTime(obj.endTime, false) : undefined,
    };
  });
};

const toJson = (obj: any, myfilter: (obj: any) => any): string => {
  return JSON.stringify(myfilter(obj));
};

export const postWorkHour = (obj: HalfwayWorkHour): Promise<Response> => {
  const method = "POST";
  const body = halfwayWorkHourToJson(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/workHours", { method, headers, body });
};

export const putWorkHour = (obj: WorkHour): Promise<Response> => {
  const method = "PUT";
  const body = workHourToJson(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/workHours", { method, headers, body });
};

export const deleteWorkHour = (obj: WorkHour): Promise<Response> => {
  const method = "DELETE";
  const body = JSON.stringify(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/workHours", { method, headers, body });
};

export const putClient = (obj: Client): Promise<Response> => {
  const method = "PUT";
  const body = JSON.stringify(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/clients", { method, headers, body });
};

export const postClient = (obj: HalfwayClient): Promise<Response> => {
  const method = "POST";
  const body = JSON.stringify(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/clients", { method, headers, body });
};
