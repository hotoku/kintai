export type Deal = {
  id?: number;
  name: string;
  clientId: number;
  isFinished: boolean;
};

export type WorkHour = {
  id?: number;
  dealId: number;
  startTime: string;
  endTime?: string;
  isDeleted?: boolean;
  note?: string;
};

export type Client = {
  id?: number;
  name: string;
};
