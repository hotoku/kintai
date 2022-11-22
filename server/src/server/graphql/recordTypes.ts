export type ClientRecord = {
  id: number;
  name: string;
};

export type DealRecord = {
  id: number;
  name: string;
  clientId: number;
};

export type WorkHourRecord = {
  id: number;
  startTime: string;
  endTime?: string;
  dealId: number;
  isDeleted: boolean;
  note: string;
};
