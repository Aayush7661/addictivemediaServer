const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const birthDetailsSchema = new Schema({
  day: {
    type: String,
  },
  month: {
    type: String,
  },
  year: {
    type: String,
  },
});
const personalDetailsSchema = new Schema(
  {
    ip: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    browser: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    birthDetails: {
      type: birthDetailsSchema,
    },
    number: {
      type: Number,
    },
    email: {
      type: String,
    },
    previousAddress:{
      type: Array,
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("personalDetails", personalDetailsSchema);
