import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import {
  clients,
  deals,
  publicDir,
  staticFiles,
  workHours,
} from "./server/routes";

import graphql from "./server/graphql";
import { port } from "./utils";

const start = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(morgan("combined"));

  deals(app);
  workHours(app);
  clients(app);
  staticFiles(app);
  graphql(app);
  app.use("*", express.static(`${publicDir}/index.html`));
  app.listen(port());
};

start();
