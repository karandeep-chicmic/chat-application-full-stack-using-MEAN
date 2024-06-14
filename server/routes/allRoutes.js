const messagesRoutes = require("./messagesRoutes");
const userRoutes = require("./userRoutes");

const routes = [...userRoutes, ...messagesRoutes];

module.exports = {routes};
