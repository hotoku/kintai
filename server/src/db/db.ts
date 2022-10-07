import { Database } from "sqlite";
import { Database as Driver } from "sqlite3";
import { sync_data_path } from "../utils";

export const getInstance = (): Database => {
  const db_dir = `${sync_data_path()}/db`;
  const db_path = db_dir + `/db.sqlite`;
  const db = new Database({
    filename: db_path,
    driver: Driver,
  });
  return db;
};
