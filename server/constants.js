const SERVER = {
  PORT: 3030,
  VIEW_PATH:
    "/home/karandeep/Desktop/Karan Practice/Node/sockets/chat-application/server/views/index.html",
  VIEW_PATH_2:
    "/home/karandeep/Desktop/Karan Practice/Node/sockets/chat-application-2/chat-application-to-push/server/views/index2.html",
  DB_USERS_PATH:
    "/home/karandeep/Desktop/Karan Practice/Node/sockets/chat-application-2/chat-application-full-stack/server/database/usersDb.json",
};

const SOCKET_EVENTS = {
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",
};

const RESPONSE_MSGS = {
  SUCCESS: "Operation Successful",
  FAILURE: "Operation Failed",
  USER_EXIST: "User Already Exist",
  USER_NOT_EXIST: "User Does Not Exist",
  INVALID_CREDENTIALS: "Invalid Credentials",
  INTERNAL_SERVER_ERR: "Internal Server Error!!",
  NO_TASK_LIST: "No task list for user",
  NO_TASK_ASSOCIATED_WITH_ID: "Cant find task associated with id",
  TASK_NAME_REQUIRED_FIELD: "taskName is a required field",
  FILL_FIELDS_CORRECTlY: "Please fill all fields correctly",
  WRONG_PASSWORD: "Wrong Password try again",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully !!",
  NO_MESSAGES: "No Message found!!",
  NO_ROOMS_FOUND: "Cannot Find room for the user !!",
};

module.exports = { SERVER, SOCKET_EVENTS, RESPONSE_MSGS };
