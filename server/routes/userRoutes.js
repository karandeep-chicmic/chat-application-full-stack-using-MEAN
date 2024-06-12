const Joi = require("joi");
const { loginUser, registerUser } = require("../controllers/userController");

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
      }
    },
    auth: false,
    file: false,
    controller: loginUser,
  },
];

module.exports = userRoutes;
