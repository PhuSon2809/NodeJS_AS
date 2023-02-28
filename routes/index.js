const express = require("express");
const bodyParser = require("body-parser");
const mainController = require("../controller/mainController");
const { ensureAuthenticated } = require("../config/auth");

const indexRouter = express.Router();

indexRouter.use(bodyParser.json());

/* GET home page. */
indexRouter.route("/").get(ensureAuthenticated, mainController.main);

module.exports = indexRouter;
