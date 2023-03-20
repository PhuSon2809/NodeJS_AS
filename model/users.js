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
      default:
        "https://lh3.googleusercontent.com/a/AGNmyxbpiHljVqZKKRi5vs6aa1N0XKoYfFFmPr5_iJo8=s96-c-rg-br100",
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
    email: {
      type: String,
      required: true,
    },
    otpSecret: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SERECT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

var Users = mongoose.model("users", userSchema);

module.exports = Users;
