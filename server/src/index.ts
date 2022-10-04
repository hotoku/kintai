import express from "express";
import bodyParser from "body-parser";

import { clients, deals, staticFiles, workHours } from "./server/routes";

const start = () => {
  const app = express();
  app.use(bodyParser.json());
  deals(app);
  workHours(app);
  clients(app);
  staticFiles(app);
  app.listen(8080);
};

start();
