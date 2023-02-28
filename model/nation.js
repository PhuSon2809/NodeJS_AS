const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const nationSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Nation must have a name!"],
      unique: true,
    },
    description: {
      type: String,
      require: [true, "Nation must have a description!"],
    },
    image: {
      type: String,
      require: [true, "Nation must have a image!"],
    },
  },
  {
    timestamps: true,
  }
);

var Nations = mongoose.model("nations", nationSchema);

module.exports = Nations;
