const fs = require("fs");
const { SERVER } = require("../constants");

const readUsers = async () => {
  try {
    const data = await fs.promises.readFile(SERVER.DB_USERS_PATH, "utf8");
    const userJson = JSON.parse(data);

    return userJson;
  } catch (err) {
    throw Error("ERROR While reading file!!");
  }
};

const writeUsers = async (usersJson) => {
  try {
    await fs.promises.writeFile(
      SERVER.DB_USERS_PATH,
      JSON.stringify(usersJson)
    );
  } catch (error) {
    throw Error("ERROR While writing file!!");
  }
};

module.exports = { readUsers, writeUsers };
