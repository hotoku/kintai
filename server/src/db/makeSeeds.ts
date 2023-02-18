import * as fs from "fs";
import dayjs, { Dayjs } from "dayjs";

const numClients = 3;
const numDealsPerClient = 3;
const numWeeks = 3;
const numWorkHoursPerDay = 3;

const clients = ["id,name"];
const deals = ["id,name,clientId"];
const workHours = ["id,dealId,startTime,endTime,isDeleted,note"];

function insertClient(clientId: number) {
  clients.push(`${clientId},client-${clientId}`);
}

function insertDeal(clientId: number, dealId: number) {
  deals.push(`${dealId},client-${clientId}/deal-${dealId},${clientId}`);
}

function insertWorkHour(
  dealId: number,
  workHourId: number,
  start: dayjs.Dayjs
): Dayjs {
  const end = start.add(1, "hour");
  workHours.push(
    `${workHourId},${dealId},${start.toISOString()},${end.toISOString()},0,note`
  );
  return end;
}

function insertOneDay(whId: number, d: Dayjs, dealIds: number[]): number {
  while (d.hour() < 19) {
    const start = d;
    const idx = Math.floor(Math.random() * dealIds.length);
    const dealId = dealIds[idx];
    d = insertWorkHour(dealId, whId, start);
    whId++;
  }
  return whId;
}

function main() {
  const numClients = 4;
  const numDealsPerClient = 3;
  const numDeals = numClients * numDealsPerClient;
  const clientIds = Array.from({ length: numClients }, (_, i) => i + 1);
  const dealIds = Array.from({ length: numDeals }, (_, i) => i + 1);
  clientIds.map(insertClient);
  dealIds.map((n) => insertDeal((n % numClients) + 1, n));

  const numDays = 20;
  let whId = 1;
  for (let i = 0; i < numDays; i++) {
    const d = dayjs().add(i, "day").set("hour", 9);
    whId = insertOneDay(whId, d, dealIds);
  }
  if (!fs.existsSync("seeds")) {
    fs.mkdirSync("seeds");
  }

  fs.writeFileSync("seeds/clients.csv", clients.join("\n") + "\n");
  fs.writeFileSync("seeds/deals.csv", deals.join("\n") + "\n");
  fs.writeFileSync("seeds/workHours.csv", workHours.join("\n") + "\n");
}
main();
