import { Database } from "sqlite";
import { Database as Driver } from "sqlite3";

export const getInstance = (): Database => {
  const db_dir =
    `${process.env.KINTAI_ONEDRIVE_PATH}/db` || `${process.cwd()}/db`;
  const db_path = db_dir + `/db.sqlite`;
  const db = new Database({
    filename: db_path,
    driver: Driver,
  });
  return db;
};
