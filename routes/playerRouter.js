const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../controller/playerController");
const authenticate = require("../middelware/authenticate");
const authorization = require("../middelware/authorization");

const playerRouter = express.Router();

playerRouter.use(bodyParser.json());

playerRouter
  .route("/")
  .get(authenticate.verifyUser, playerController.players)
  .post(
    authenticate.verifyUser,
    authorization.isAdmin,
    playerController.create
  );

playerRouter
  .route("/:slug")
  .get(authenticate.verifyUser, playerController.playerDetail);

playerRouter
  .route("/edit/:playerId")
  .get(
    authenticate.verifyUser,
    authorization.isAdmin,
    playerController.getForFormEdit
  )
  .put(authenticate.verifyUser, authorization.isAdmin, playerController.update);

playerRouter
  .route("/delete/:playerId")
  .delete(
    authenticate.verifyUser,
    authorization.isAdmin,
    playerController.delete
  );

module.exports = playerRouter;
