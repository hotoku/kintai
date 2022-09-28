import { Deal, WorkHour } from "./types";

export const fetchDeals = async (cb: (ds: Deal[]) => void) => {
  const res = await fetch("/api/deals");
  const data = (await res.json()) as Deal[];
  cb(data);
};

export const fetchWorkHours = async (
  dealId: number,
  cb: (ws: WorkHour[]) => void
) => {
  const res = await fetch(`/api/workHours?dealId=${dealId}`);
  const data = (await res.json()) as WorkHour[];
  cb(data);
};

export const postWorkHours = async (obj: WorkHour) => {
  const method = "POST";
  const body = JSON.stringify(obj);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  await fetch("/api/workHours", { method, headers, body });
};
