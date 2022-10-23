import { getInstance } from "./db";

const migrate = async () => {
  const db = await getInstance();
  await db.migrate({});
};

migrate();
