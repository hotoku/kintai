import * as fs from "fs";

const numClients = 100;
const numDealsPerClient = 100;
const numWorkHoursPerDeal = 200;

const clients = ["id,name"];
const deals = ["id,name,clientId"];
const workHours = ["id,dealId,startTime,endTime,isDeleted,note"];

let clientId = 1;
let dealId = 1;
let workHourId = 1;

function insertClient() {
  clients.push(`${clientId},client-${clientId}`);
}

function insertDeal() {
  deals.push(`${dealId},client-${clientId}/deal-${dealId},${clientId}`);
}

function insertWorkHour() {
  workHours.push(`${workHourId}`);
}

while (clientId <= numClients) {
  insertClient();
  let numDeal = 0;
  while (numDeal < numDealsPerClient) {
    insertDeal();
    let numWorkHour = 0;
    while (numWorkHour < numWorkHoursPerDeal) {
      insertWorkHour();
      numWorkHour++;
      workHourId++;
    }
    numDeal++;
    dealId++;
  }
  clientId++;
}

fs.writeFileSync("seeds/clients.csv", clients.join("\n") + "\n");
fs.writeFileSync("seeds/deals.csv", deals.join("\n") + "\n");
fs.writeFileSync("seeds/workHours.csv", workHours.join("\n") + "\n");
