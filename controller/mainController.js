const Nations = require("../model/nation");
const Players = require("../model/player");

class mainController {
  main(req, res, next) {
    Promise.all([Nations.find({}).limit(4), Players.find({}).limit(4)])
      .then(([nations, players]) => {
        res.render("dashboard", {
          title: "Home page - World Cup 2022",
          nations: nations,
          players: players,
        });
      })
      .catch(next);
  }
}

module.exports = new mainController();
