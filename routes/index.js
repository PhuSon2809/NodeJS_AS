const express = require("express");
const bodyParser = require("body-parser");
const mainController = require("../controller/mainController");

const indexRouter = express.Router();

indexRouter.use(bodyParser.json());

/* GET home page. */
indexRouter.route("/").get(mainController.main);

module.exports = indexRouter;
