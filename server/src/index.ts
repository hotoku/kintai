import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { clients, deals, staticFiles, workHours } from "./server/routes";
import { port } from "./utils";

const start = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(morgan("combined"));

  deals(app);
  workHours(app);
  clients(app);
  staticFiles(app);

  app.listen(port());
};

start();
