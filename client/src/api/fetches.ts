import {
  Deal,
  HalfwayWorkHour,
  WorkHour,
  Client,
  HalfwayClient,
} from "./types";
import { formatDateTime } from "../share/utils";

export const fetchDeals = async (cb: (ds: Deal[]) => void) => {
  const res = await fetch("/api/deals");
  const data = (await res.json()) as Deal[];
  cb(data);
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

export const postDeal = (obj: {
  name: string;
  clientId: number;
}): Promise<Response> => {
  const method = "POST";
  const body = JSON.stringify(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return fetch("/api/deals", { method, headers, body });
};

export const fetchClients = async (cb: (ds: Deal[]) => void) => {
  const res = await fetch("/api/clients");
  const data = (await res.json()) as Deal[];
  cb(data);
};

export const fetchWorkHours = async (
  dealId: number,
  cb: (ws: WorkHour[]) => void
) => {
  const res = await fetch(`/api/workHours?dealId=${dealId}`);
  const data = await res.json();
  const ret: WorkHour[] = data.map((x: any) => {
    return {
      id: x["id"],
      dealId: x["dealId"],
      startTime: new Date(x["startTime"]),
      endTime: x["endTime"] ? new Date(x["endTime"]) : undefined,
    };
  });
  cb(ret);
};

const halfwayWorkHourToJson = (obj: HalfwayWorkHour): string => {
  return JSON.stringify({
    id: obj.id,
    dealId: obj.dealId,
    startTime: obj.startTime ? formatDateTime(obj.startTime, false) : undefined,
    endTime: obj.endTime ? formatDateTime(obj.endTime, false) : undefined,
  });
};

const workHourToJson = (obj: WorkHour): string => {
  return JSON.stringify({
    id: obj.id,
    dealId: obj.dealId,
    startTime: formatDateTime(obj.startTime, false),
    endTime: obj.endTime ? formatDateTime(obj.endTime, false) : undefined,
  });
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
