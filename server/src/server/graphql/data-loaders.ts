import DataLoader from "dataloader";

export type ClientRecord = {
  id: number;
  name: string;
};

export function createClientLoader(): DataLoader<number, ClientRecord> {
  return new DataLoader<number, ClientRecord>(async (ids) => {
    const ret = [] as ClientRecord[];
    for (const id of ids) {
      ret.push({
        id: id,
        name: `client-${id}`,
      });
    }
    return ret;
  });
}

export type MyDataLoader = {
  clientLoader: DataLoader<number, ClientRecord>;
};
