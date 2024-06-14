const {
  getMessages,
  prevChatUser,
  updateRoom,
} = require("../controllers/messagesController");

const messagesRoutes = [
  {
    method: "GET",
    path: "/messages/:roomId",
    schema: {
      // body: {},
    },
    auth: true,
    file: false,
    controller: getMessages,
  },
  {
    method: "GET",
    path: "/prevChat",
    schema: {
      // body: {},
    },
    auth: true,
    file: false,
    controller: prevChatUser,
  },
  {
    method: "PUT",
    path: "/messages/:roomId",
    schema: {
      // body: {},
    },
    auth: true,
    file: false,
    controller: updateRoom,
  },
];

module.exports = messagesRoutes;
