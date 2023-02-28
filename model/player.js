const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Player must have a name!"],
      unique: true,
    },
    image: {
      type: String,
      require: [true, "Player must have a image!"],
    },
    club: {
      type: String,
      require: [true, "Player must have a club!"],
    },
    position: {
      type: String,
      require: [true, "Player must have a position!"],
    },
    description: {
      type: String,
      require: [true, "Nation must have a description!"],
    },
    goals: {
      type: Number,
      require: [true, "Player must have a goals!"],
    },
    isCaptain: {
      type: Boolean,
      require: [true, "Player must have a isCaptain!"],
    },
  },
  {
    timestamps: true,
  }
);

var Players = mongoose.model("players", playerSchema);

module.exports = Players;
