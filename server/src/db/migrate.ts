import { getInstance } from "./db";

const migrate = async () => {
  const db = getInstance();
  await db.open();
  await db.migrate({});
};

migrate();
