const { Schema, model } = require("mongoose");

const messagesSchema = new Schema(
  {
    sendersId: {
      type: String,
      required: true,
    },
    receiversId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    messageContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messagesModel = model("messages", messagesSchema, "messages");
module.exports = {messagesModel};
