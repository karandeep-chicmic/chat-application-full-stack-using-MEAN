const { SOCKET_EVENTS } = require("../constants.js");
const { messagesModel } = require("../models/messagesModel.js");
const { roomModel } = require("../models/roomsModel.js");
const { userModel } = require("../models/userModel.js");

// Creating a room name for user
const createRoomName = (senderId, receiverId) => {
  return [senderId, receiverId].sort().join("-");
};

const events = async (socket, io) => {
  console.log("New user connected to chat with id : ", socket.id);

  // join room by roomname
  socket.on(SOCKET_EVENTS.JOIN_BY_ROOM_NAME, (roomName) =>{
    socket.join(roomName);
  })


  socket.on(
    SOCKET_EVENTS.GROUP_JOIN,
    async (usersArr, roomName, callback) => {
      if (typeof callback !== "function") {
        console.error("Callback is not a function");
        return;
      }

      try {
        const users = await Promise.all(
          usersArr.map(async (user) => {
            const findUser = await userModel.findOne({ _id: user });
            return {
              _id: findUser._id,
              name: findUser.name,
              email: findUser.email,
              profilePicture: findUser.profilePicture,
            };
          })
        );

        const data = await roomModel.findOneAndUpdate(
          { roomName: roomName },
          {
            $set: {
              roomName: roomName,
              users: users,
            },
          },
          { upsert: true }
        );

        callback({ roomId: roomName, data: users });
      } catch (error) {
        console.error("Error finding users: ", error);
        callback({ roomId: roomName, data: [], error: "Error finding users" });
      }
    }
  );

  // Join room for one user
  socket.on(
    SOCKET_EVENTS.JOIN_ROOM,
    async (sendersId, receiverId, callback) => {
      if (typeof callback !== "function") {
        console.error("Callback is not a function");
        return;
      }

      const roomName = createRoomName(sendersId, receiverId);

      socket.join(roomName);

      let usersArr = [];
      const sender = await userModel.findOne({ _id: sendersId }).lean();
      const receiver = await userModel.findOne({ _id: receiverId }).lean();

      usersArr.push({
        _id: sender._id,
        name: sender.name,
        email: sender.email,
        profilePicture: sender.profilePicture,
      });

      usersArr.push({
        _id: receiver._id,
        name: receiver.name,
        email: receiver.email,
        profilePicture: receiver.profilePicture,
      });

      const data = await roomModel.findOneAndUpdate(
        { roomName: roomName },
        {
          $set: {
            roomName: roomName,
            users: usersArr,
          },
        },
        { upsert: true }
      );

      callback({ roomId: roomName, data: data });
    }
  );

  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    async (senderId, receiverId, roomId, messageContent, callback) => {
      if (typeof callback !== "function") {
        console.error("Callback is not a function");
        return;
      }
      try {
        const message = {
          roomId: roomId,
          senderId: senderId,
          receiverId: receiverId,
          messageContent: messageContent,
        };

        const messageSent = await messagesModel.create({
          sendersId: senderId,
          receiversId: receiverId,
          roomId: roomId,
          messageContent: messageContent,
        });

        socket.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageSent);
        socket.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageSent);

        callback({ messageSent });
      } catch (e) {
        console.log(e);
      }
    }
  );

  //   On disconnection
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("User disconnected with id : ", socket.id);
  });
};

module.exports = { events };
