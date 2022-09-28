export type Deal = {
  id?: number;
  name: string;
};

export type WorkHour = {
  id?: number;
  dealId: number;
  startTime: string;
  endTime?: string;
};
