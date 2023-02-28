const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../controller/playerController");

const playerRouter = express.Router();

playerRouter.use(bodyParser.json());

playerRouter
  .route("/")
  .get(playerController.players)
  .post(playerController.create);

playerRouter
  .route("/:playerId")
  .get(playerController.playerDetail)

playerRouter
  .route("/edit/:playerId")
  .get(playerController.getForFormEdit)
  .put(playerController.update);

playerRouter.route("/delete/:playerId").delete(playerController.delete);

module.exports = playerRouter;
