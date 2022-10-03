export type Deal = {
  id: number;
  name: string;
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
