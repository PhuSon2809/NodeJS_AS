const bcrypt = require("bcrypt");
var passport = require("passport");
const Users = require("../model/users");

class userController {
  signup(req, res, next) {
    res.render("register");
  }

  register(req, res, next) {
    const { username, password, fullName, YOB } = req.body;
    console.log(username, password);
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
                res.redirect("/users/login");
              })
              .catch(next);
          });
        }
      });
    }
  }

  login(req, res, next) {
    res.render("login");
  }

  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login/",
      failureFlash: true,
    })(req, res, next);
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
        res.render("listUser", {
          title: "List user",
          users: users,
        });
      })
      .catch(next);
  }

  userInfor(req, res, next) {
    res.render("userInfor");
  }
}

module.exports = new userController();
