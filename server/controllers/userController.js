const fs = require("fs");
const { RESPONSE_MSGS } = require("../constants");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const { userModel } = require("../models/userModel");

dotenv.config();

const saltRounds = 10;

// get all users
async function getUsers(payload) {
  const { searchInput } = payload;

  const data = await userModel.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: searchInput, $options: "i" } },
          { email: { $regex: searchInput, $options: "i" } },
        ],
      },
    },
    {
      $project: { name: 1, email: 1, profilePicture: 1, _id: 1 },
    },
  ]);

  return {
    statusCode: 200,
    data: data,
  };
}

async function getUser(payload) {
  let { userId } = payload;
  const data = await userModel.findOne({ _id: userId });

  if (data) {
    return {
      statusCode: 200,
      data: data,
    };
  }

  return {
    statusCode: 404,
    data: RESPONSE_MSGS.INVALID_CREDENTIALS,
  };
}
async function getUserById(payload) {
  let { id } = payload;
  const data = await userModel.findOne({ _id: id });

  if (data) {
    return {
      statusCode: 200,
      data: data,
    };
  }

  return {
    statusCode: 404,
    data: RESPONSE_MSGS.INVALID_CREDENTIALS,
  };
}

async function deleteUser(req, res) {}

async function registerUser(payload) {
  const { name, email, password, file } = payload;

  const salt = bcrypt.genSaltSync(saltRounds);

  const objToSaveToDb = {
    name: name,
    password: bcrypt.hashSync(password, salt),
    email: email,
    profilePicture: file.path,
  };

  const registerUserM = await userModel.create(objToSaveToDb);

  const token = jwt.sign(
    { id: registerUserM._id, email: email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "2500s",
    }
  );

  const response = {
    message: "User Added Successfully",
    userDetails: registerUserM,
    token: token,
    userId: registerUserM._id,
  };

  return {
    statusCode: 201,
    data: response,
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  var passwordMatch;
  var userFound = await userModel.findOne({ email: email });

  if (userFound) {
    passwordMatch = bcrypt.compareSync(password, userFound.password);
  } else {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.USER_NOT_EXIST,
    };
  }

  if (passwordMatch) {
    const token = jwt.sign(
      { id: userFound.id, email: email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2500s",
      }
    );

    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        token: token,
        email: email,
        userId: userFound._id,
      },
    };
  } else {
    return {
      statusCode: 401,
      data: RESPONSE_MSGS.WRONG_PASSWORD,
    };
  }
}

async function updateUser(req, res) {}

module.exports = {
  updateUser,
  getUsers,
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  getUser,
};
