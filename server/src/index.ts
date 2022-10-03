import express from "express";
import bodyParser from "body-parser";

import { deals, workHours } from "./server/routes";

const start = () => {
  const app = express();
  app.use(bodyParser.json());
  deals(app);
  workHours(app);
  app.listen(8080);
};

start();
