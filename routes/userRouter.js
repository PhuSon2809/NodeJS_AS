const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../controller/userController");

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.route("/register").get(userController.signup).post(userController.register);
userRouter
  .route("/login")
  .get(userController.login)
  .post(userController.signin);
userRouter.route("/logout").get(userController.signout);
userRouter.route("/listuser").get(userController.listUser);
userRouter.route("/infor").get(userController.userInfor);

module.exports = userRouter;
