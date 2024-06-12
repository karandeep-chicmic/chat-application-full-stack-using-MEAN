const { SOCKET_EVENTS } = require("../constants.js");
const { messagesModel } = require("../models/messagesModel.js");

// Creating a room name for user
const createRoomName = (senderId, receiverId) => {
  console.log([senderId, receiverId].sort().join("-"));
  return [senderId, receiverId].sort().join("-");
};

const events = async (socket, io) => {
  console.log("New user connected to chat with id : ", socket.id);

  // Join room for one user
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (sendersId, receiverId, callback) => {
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }

    const roomName = createRoomName(sendersId, receiverId);

    socket.join(roomName);

    console.log(`Room joined. named: ${roomName}`);
    callback({ roomId: roomName });
  });

  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    async (senderId, receiverId, roomId, messageContent) => {
      try{
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
      
      io.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageSent);
    }catch(e){console.log(e)}
  }
  );

  //   socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
  //     console.log("Received message", data);
  //   });

  //   On disconnection
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("User disconnected with id : ", socket.id);
  });
};

module.exports = { events };
