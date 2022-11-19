export type ClientRecord = {
  id: number;
  name: string;
};

export type MyDataLoader = {
  clientLoader: { load: (id: number) => {} };
};
