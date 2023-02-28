const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "/images/user.png",
    },
    fullName: {
      type: String,
      required: true,
    },
    YOB: {
      type: Number,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

var Users = mongoose.model("users", userSchema);

module.exports = Users;
