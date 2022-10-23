import { getInstance } from "./db";

const run = async () => {
  const db = await getInstance();
  await db.run(`
delete from Deals;      
    `);
};

run();
