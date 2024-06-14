const { Schema, model } = require("mongoose");

const roomsSchema = new Schema(
  {
    roomName: {
      type: String,
      required: true,
      unique: true,
    },
    users: {
      type: [Object],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = model("room", roomsSchema, "room");

module.exports = { roomModel };
