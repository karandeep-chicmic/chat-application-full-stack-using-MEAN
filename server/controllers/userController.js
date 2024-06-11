const fs = require("fs");
const { RESPONSE_MSGS } = require("../constants");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { readUsers, writeUsers } = require("../fileSystem/userReadWrite");

dotenv.config();

const saltRounds = 10;
async function getUsers(req, res) {}

async function deleteUser(req, res) {}

async function registerUser(payload) {
  const { name, email, password, file } = payload;
  
  console.log(payload);
  const salt = bcrypt.genSaltSync(saltRounds);
  
  const objToSaveToDb = {
    id: Date.now(),
    name: name,
    password: bcrypt.hashSync(password, salt),
    email: email,
    profilePicture: file.path,
  };

  console.log(objToSaveToDb);
  const usersArr = await readUsers();
  const usersJson = usersArr;

  const user = usersJson.dataArray.find(
    (data) => data.email === objToSaveToDb.email
  );

  if (user) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.USER_EXIST,
    };
  }

  //  push to the array
  usersJson.dataArray.push(objToSaveToDb);

  await writeUsers(usersJson);

  const response = {
    message: "User Added Successfully",
    userDetails: objToSaveToDb,
  };
  return {
    statusCode: 201,
    data: response,
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  const usersArr = await readUsers();

  const usersJson = usersArr;

  const userFound = usersJson.dataArray.find((data) => {
    if (data.email === email) {
      return true;
    }
    return false;
  });

  var passwordMatch;
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

module.exports = { updateUser, getUsers, loginUser, registerUser, deleteUser };
