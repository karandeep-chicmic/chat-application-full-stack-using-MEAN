const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const { SERVER } = require("./constants");
const startExpress = require("./middlewares/startExpressMiddleware");

const server = http.createServer(app);

const startNodeServer = async () => {
  await startExpress(app, server);
};

mongoose.connect("mongodb://localhost:27017/chatApp", {});
mongoose.connection.on("connected", () => {
  console.log("MongoDb is successfully Connected!!");
});
mongoose.connection.on("error", (err) => {
  console.log(`mongoDb not connected due to error ${err}`);
});

startNodeServer()
  .then(() => {
    server.listen(SERVER.PORT, () => {
      console.log(`Server is running on port ${SERVER.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error is : ", err.message);
  });
