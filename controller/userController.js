const bcrypt = require("bcrypt");
var passport = require("passport");
const Users = require("../model/users");
const sendToken = require("../config/jwttoken");
require("../middelware/passport")(passport);

class userController {
  signupPage(req, res, next) {
    res.render("register", {
      title: "Register page",
    });
  }

  async register(req, res, next) {
    const { username, password, fullName, YOB } = req.body;
    let errors = [];
    if (!username || !password || !fullName || !YOB) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
        fullName,
        YOB,
      });
    } else {
      Users.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
            fullName,
            YOB,
          });
        } else {
          const newUser = new Users({
            username,
            password,
            fullName,
            YOB,
          });
          //Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                sendToken(user, 200, res);
                res.redirect("/users/login");
              })
              .catch((err) => {
                errors.push("Fail to create user");
                res.render("register", {
                  errors,
                });
              });
          });
        }
      });
    }
  }

  signinPage(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("login", {
        title: "Login page",
      });
    }
  }

  signin(req, res, next) {
    console.log(req);
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Authorization", token);
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }

  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are logged out");
      res.redirect("/users/login");
    });
  }

  listUser(req, res, next) {
    Users.find({})
      .then((users) => {
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.user = req.user;
        res.render("listUser", {
          title: "List user",
          users: users,
        });
      })
      .catch(next);
  }

  userInfor(req, res, next) {
    const userId = req.params.userId;
    Users.findById(userId).then((user) => {
      res.locals.isAuthenticated = req.isAuthenticated();
      res.locals.user = req.user;
      res.render("userInfor", {
        title: "User Information - World Cup 2022",
        user: user,
      });
    });
  }

  getForFormEdit(req, res, next) {
    const userId = req.params.userId;
    Users.findById(userId).then((user) => {
      res.json({
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          YOB: user.YOB,
          image: user.image,
        },
      });
    });
  }

  update(req, res, next) {
    const userId = req.params.userId;
    if (!userId) {
      return next(new ErrorHandler("Not found user!", 404));
    }
    Users.findByIdAndUpdate(userId, req.body, { new: true })
      .then((user) => {
        res.redirect(`/users/infor/${userId}`);
      })
      .catch(next);
  }
}

module.exports = new userController();
