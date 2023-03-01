const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
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

userSchema.plugin(passportLocalMongoose);

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SERECT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

//Compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

var Users = mongoose.model("users", userSchema);

module.exports = Users;
