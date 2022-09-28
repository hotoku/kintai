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
