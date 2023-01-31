import * as fs from "fs";
import dayjs from "dayjs";

const numClients = 10;
const numDealsPerClient = 3;
const numWorkHoursPerDeal = 3;

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
) {
  const end = start.add(1, "hour");
  workHours.push(
    `${workHourId},${dealId},${start.toISOString()},${end.toISOString()},0,note`
  );
}

function main() {
  let clientId = 1;
  let dealId = 1;
  let workHourId = 1;
  let start0 = dayjs("2023-01-01T09:00:00");

  while (clientId <= numClients) {
    insertClient(clientId);
    let numDeal = 0;
    while (numDeal < numDealsPerClient) {
      insertDeal(clientId, dealId);
      let numWorkHour = 0;
      while (numWorkHour < numWorkHoursPerDeal) {
        let start = start0;
        insertWorkHour(dealId, workHourId, start);
        numWorkHour++;
        workHourId++;
        start = start.add(1, "hour");
        if (start.hour() > 18) {
          start = start.add(1, "day").hour(9);
        }
      }
      numDeal++;
      dealId++;
    }
    clientId++;
  }
  if (!fs.existsSync("seeds")) {
    fs.mkdirSync("seeds");
  }

  fs.writeFileSync("seeds/clients.csv", clients.join("\n") + "\n");
  fs.writeFileSync("seeds/deals.csv", deals.join("\n") + "\n");
  fs.writeFileSync("seeds/workHours.csv", workHours.join("\n") + "\n");
}
main();
