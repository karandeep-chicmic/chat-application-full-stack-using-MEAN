const { SOCKET_EVENTS } = require("../constants.js");

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
    (senderId, receiverId, roomId, messageContent) => {
      const message = {
        roomId: roomId,
        senderId: senderId,
        receiverId: receiverId,
        messageContent: messageContent,
      };

      //
      io.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
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
