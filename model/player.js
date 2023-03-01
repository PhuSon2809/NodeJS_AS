const mongoose = require("mongoose");
const slugify = require("slugify");

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
    slug: String,
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
    // nation: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "nations",
    //   require: true,
    // },
  },
  {
    timestamps: true,
  }
);

playerSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

var Players = mongoose.model("players", playerSchema);

module.exports = Players;
