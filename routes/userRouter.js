const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../controller/userController");
const authenticate = require("../middelware/authenticate");
const authorization = require("../middelware/authorization");
var passport = require("passport");

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter
  .route("/register")
  .get(userController.signupPage)
  .post(userController.register);

userRouter
  .route("/login")
  .get(userController.signinPage)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    userController.signin
  );

userRouter.route("/logout").get(userController.signout);

userRouter
  .route("/listuser")
  .get(authenticate.verifyUser, authorization.isAdmin, userController.listUser);

userRouter.route("/infor/:userId").get(userController.userInfor);

userRouter
  .route("/infor/edit/:userId")
  .get(authenticate.verifyUser, userController.getForFormEdit)
  .put(authenticate.verifyUser, userController.update);

module.exports = userRouter;
