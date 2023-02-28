const express = require("express");
const bodyParser = require("body-parser");
const nationController = require("../controller/nationController");

const nationRouter = express.Router();

nationRouter.use(bodyParser.json());

nationRouter
  .route("/")
  .get(nationController.nations)
  .post(nationController.create);

nationRouter.route("/:nationId").get(nationController.nationDetail);

nationRouter
  .route("/edit/:nationId")
  .get(nationController.getForFormEdit)
  .put(nationController.update);

nationRouter.route("/delete/:nationId").delete(nationController.delete);

module.exports = nationRouter;
