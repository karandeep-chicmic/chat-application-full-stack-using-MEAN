const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const { SERVER } = require("../constants");
const { events } = require("../events/chatEvents");
const { routes } = require("../routes/allRoutes");
const { authorizeUser } = require("./authMiddleware");
const { validate } = require("./validateMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploads = multer({ storage: storage });

const handlers = (route) => {
  return (req, res) => {
    let payload = {
      ...(req.body || {}),
      ...(req.query || {}),
      ...(req.params || {}),
      userId: req.userId,
      file: req.file,
    };
    route
      .controller(payload)
      .then((result) => {
        res.status(result.statusCode).json(result.data);
      })
      .catch((err) => {
        if (err?.statusCode) {
          res.status(err?.statusCode).json(err.message);
        }
        res.status(500).json(err.message);
      });
  };
};

const startExpress = async (app, server) => {
  app.use(cors());
  app.use(express.json());
  app.use("/public", express.static("public"));

  const io = new Server(server, {
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.of("/chat").on("connection", async (socket) => {
    await events(socket, io);
  });

  routes.forEach((data) => {
    let middlewares = [];
    if (data.auth) {
      middlewares.push(authorizeUser());
    }
    if (data.schema) {
      middlewares.push(validate(data.schema));
    }
    if (data.file) {
      middlewares.push(uploads.single("file"));
    }

    app
      .route(data.path)
      [data.method.toLowerCase()](...middlewares, handlers(data));
  });
};

module.exports = startExpress;

// app.get("/", (req, res) => {
//   res.sendFile(SERVER.VIEW_PATH_2);
// });
