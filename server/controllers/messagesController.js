const { RESPONSE_MSGS } = require("../constants");
const { messagesModel } = require("../models/messagesModel");
const { roomModel } = require("../models/roomsModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

async function getMessages(payload) {
  const { roomId } = payload;
  const data = await messagesModel.find({
    roomId: roomId,
  });

  if (data.length <= 0) {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.NO_MESSAGES,
    };
  }

  return {
    statusCode: 200,
    data: data,
  };
}

async function prevChatUser(payload) {
  const { userId } = payload;
  console.log(userId);

  const data = await roomModel.find({
    "users._id": new ObjectId(userId),
  });
  
  if (data.length <= 0) {
    return { statusCode: 404, data: RESPONSE_MSGS.NO_ROOMS_FOUND };
  }

  return {
    statusCode: 200,
    data: data,
  };
}

const createRoomName = (senderId, receiverId) => {
  console.log([senderId, receiverId].sort().join("-"));
  return [senderId, receiverId].sort().join("-");
};

module.exports = { getMessages, prevChatUser };
