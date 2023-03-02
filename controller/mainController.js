const Nations = require("../model/nation");
const Players = require("../model/player");

class mainController {
  main(req, res, next) {
    Promise.all([
      Nations.find({}).limit(4),
      Players.find({ isCaptain: true }).populate("nation"),
    ])
      .then(([nations, players]) => {
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.user = req.user;
        res.render("index", {
          title: "Home page - World Cup 2022",
          nations: nations,
          players: players,
        });
      })
      .catch(next);
  }
}

module.exports = new mainController();
