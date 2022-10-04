export type Deal = {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
};

export type WorkHour = {
  id: number;
  dealId: number;
  startTime: Date;
  endTime?: Date;
};

export type HalfwayWorkHour = {
  id?: number;
  dealId: number;
  startTime?: Date;
  endTime?: Date;
};

export type Client = {
  id: number;
  name: string;
};

export type HalfwayClient = {
  id?: number;
  name?: string;
};
