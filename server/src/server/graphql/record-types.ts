export type ClientRecord = {
  id: number;
  name: string;
};

export type DealRecord = {
  id: number;
  name: string;
  clientId: number;
};
