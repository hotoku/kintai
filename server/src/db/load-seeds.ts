import * as fs from "fs";
import { getInstance } from "./db";

import { Deal } from "./types";

const loadSeed = async () => {
  const seedFile = `${process.cwd()}/seeds/deals.json`;
  const contents = fs.readFileSync(seedFile).toString();
  const deals = JSON.parse(contents) as Deal[];
  const db = getInstance();
  db.open();
  for (const deal of deals) {
    await db.run(
      `
insert into deals
(
  name
)
values
(
  ?
)
`,
      deal.name
    );
  }
};

loadSeed();
