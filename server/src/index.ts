import express from "express";

const start = () => {
  const app = express();
  app.use("/api/deals", () => {
    console.log("deals");
  });

  app.listen(8080);
};

start();
