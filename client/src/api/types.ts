export type Deal = {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
};

export type HalfwayDeal = {
  id?: number;
  name?: string;
  clientId?: number;
  clientName?: string;
};

export type WorkHour = {
  id: number;
  dealId: number;
  startTime: Date;
  endTime?: Date;
  isDeleted?: boolean;
  note?: string;
};

export type HalfwayWorkHour = {
  id?: number;
  dealId?: number;
  startTime?: Date;
  endTime?: Date;
  note?: string;
};

export type Client = {
  id: number;
  name: string;
};

export type HalfwayClient = {
  id?: number;
  name?: string;
};
