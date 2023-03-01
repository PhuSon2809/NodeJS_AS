const express = require("express");
const bodyParser = require("body-parser");
const nationController = require("../controller/nationController");
const authenticate = require("../middelware/authenticate");
const authorization = require("../middelware/authorization");

const nationRouter = express.Router();

nationRouter.use(bodyParser.json());

nationRouter
  .route("/")
  .get(authenticate.verifyUser, nationController.nations)
  .post(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationController.create
  );

nationRouter
  .route("/:nationId")
  .get(authenticate.verifyUser, nationController.nationDetail);

nationRouter
  .route("/edit/:nationId")
  .get(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationController.getForFormEdit
  )
  .put(authenticate.verifyUser, authorization.isAdmin, nationController.update);

nationRouter
  .route("/delete/:nationId")
  .delete(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationController.delete
  );

module.exports = nationRouter;
