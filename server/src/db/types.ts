export type Deal = {
  id?: number;
  name: string;
  clientId: number;
};

export type WorkHour = {
  id?: number;
  dealId: number;
  startTime: string;
  endTime?: string;
  isDeleted?: boolean;
};

export type Client = {
  id?: number;
  name: string;
};
