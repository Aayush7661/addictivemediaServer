const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenData = new Schema(
  {
    token: {
      type: String,
      default: "",
    },
    deviceId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("tokenData", tokenData);
