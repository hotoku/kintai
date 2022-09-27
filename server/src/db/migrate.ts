import { Database } from "sqlite";
import { Database as Driver } from "sqlite3";

const migrate = async () => {
  const db_path = `${process.cwd()}/db/db.sqlite`;
  const db = new Database({
    filename: db_path,
    driver: Driver,
  });
  await db.open();
  await db.migrate({});
};

migrate();
