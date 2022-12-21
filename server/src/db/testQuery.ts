/**
 * DBへのクエリの検証に使う
 */

import { getConnection } from "./db";

async function main() {
  const con = await getConnection();
  const [rows, _] = await con.query(
    `
    select
      id,
      name
    from
      clients
    where
      id in (?)`,
    [[1, 2]]
  );
  console.log(rows);
  await con.end();
  return;
}

main();
