const { getMessages, prevChatUser } = require("../controllers/messagesController");

const messagesRoutes = [
  {
    method: "GET",
    path: "/messages",
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


];

module.exports = messagesRoutes;
