const express = require("express");
const app = express();

const http = require("http");
const { SERVER } = require("./constants");
const startExpress = require("./middlewares/startExpressMiddleware");

const server = http.createServer(app);

const startNodeServer = async () => {
  await startExpress(app, server);
};

startNodeServer()
  .then(() => {
    server.listen(SERVER.PORT, () => {
      console.log(`Server is running on port ${SERVER.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error is : ", err.message);
  });


  