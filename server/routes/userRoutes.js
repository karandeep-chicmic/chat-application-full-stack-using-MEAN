const Joi = require("joi");
const {
  loginUser,
  registerUser,
  getUserById,
  getUser,
  getUsers,
} = require("../controllers/userController");

const userRoutes = [
  {
    method: "POST",
    path: "/user/register",
    schema: {
      body: {
        file: Joi.string().optional(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      },
    },
    auth: false,
    file: true,
    controller: registerUser,
  },
  {
    method: "POST",
    path: "/user/login",
    schema: {
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      },
    },
    auth: false,
    file: false,
    controller: loginUser,
  },
  {
    method: "GET",
    path: "/user/:id",
    schema: {
      params: {
        id: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: getUserById,
  },
  {
    method: "GET",
    path: "/user",
    schema: {},
    auth: true,
    file: false,
    controller: getUser,
  },
  {
    method: "GET",
    path: "/user/search/:searchInput",
    schema: {},
    auth: true,
    file: false,
    controller: getUsers,
  },
];

module.exports = userRoutes;
