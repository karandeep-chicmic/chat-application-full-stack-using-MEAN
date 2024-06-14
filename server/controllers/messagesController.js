const { RESPONSE_MSGS } = require("../constants");
const { messagesModel } = require("../models/messagesModel");
const { roomModel } = require("../models/roomsModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

async function getMessages(payload) {
  const { roomId, userId } = payload;

  const data = await messagesModel
    .find({
      roomId: roomId,
    })
    .limit(10);

  if (data.length <= 0) {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.NO_MESSAGES,
    };
  }

  data.forEach((res) => {
    if (res?.sendersId != userId || res?.receiversId != userId) {
      return {
        statusCode: 401,
        data: RESPONSE_MSGS.FAILURE,
      };
    }
  });
  return {
    statusCode: 200,
    data: data,
  };
}

async function prevChatUser(payload) {
  const { userId } = payload;
  console.log(userId);

  const data = await roomModel
    .find({
      "users._id": new ObjectId(userId),
    })
    .sort({ updatedAt: -1 });

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

async function updateRoom(payload) {
  const { roomId } = payload;
  const data = await roomModel.findOneAndUpdate(
    { roomName: roomId },
    {
      $set: { roomName: roomId },
    }
  );
  if (!data) {
    return { statusCode: 404, data: RESPONSE_MSGS.NO_ROOMS_FOUND };
  }

  return {
    statusCode: 200,
    data: data,
  };
}

module.exports = { getMessages, prevChatUser, updateRoom };
