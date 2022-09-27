import { Database } from "sqlite";
import { Database as Driver } from "sqlite3";

export const getInstance = (): Database => {
  const db_path = `${process.cwd()}/db/db.sqlite`;
  const db = new Database({
    filename: db_path,
    driver: Driver,
  });
  return db;
};
