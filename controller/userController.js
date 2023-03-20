const bcrypt = require("bcrypt");
var passport = require("passport");
const Users = require("../model/users");
const sendToken = require("../config/jwttoken");
const speakeasy = require("speakeasy");
const sendEmail = require("../middelware/sendEmail");
const bycrypt = require("bcrypt");
require("../middelware/passport")(passport);

class userController {
  signupPage(req, res, next) {
    res.render("register", {
      title: "Register page",
    });
  }

  async register(req, res, next) {
    const { username, email, password, fullName, YOB } = req.body;
    let errors = [];
    if (!username || !password || !email || !fullName || !YOB) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        email,
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
            email,
            password,
            fullName,
            YOB,
          });
        } else {
          const secret = speakeasy.generateSecret({ length: 20 });
          const newUser = new Users({
            username,
            password,
            fullName,
            YOB,
            email,
            otpSecret: secret.base32,
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

  formForgotPassword(req, res, next) {
    res.render("forgotpassword");
  }

  async forgotPassword(req, res, next) {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/users/forgotpassword");
    }
    console.log(user.email);
    console.log(user.otpSecret);
    const otp = speakeasy.totp({
      secret: user.otpSecret,
      digits: 6,
      window: 20,
    });
    console.log(otp);

    const message = `Your OTP code for password recovery is: ${otp}`;

    try {
      await sendEmail(user.email, {
        subject: "Password Recovery",
        message,
      });
      console.log(user.email);

      // await sendSMS(user.phone, { message });

      req.session.forgotpassword = {
        email: user.email,
        otpSecret: user.otpSecret,
      };

      return res.render("verifyOtp");
    } catch (error) {}
  }

  async verifyOtp(req, res, next) {
    const { email, otpSecret } = req.session.forgotpassword;

    const isVerified = speakeasy.totp.verify({
      secret: otpSecret,
      token: req.body.otp,
      digits: 6,
      window: 1,
    });

    if (!isVerified) {
      req.flash("error_msg", "Invalid OTP code");
      return res.render("verifyOtp");
    } else {
      req.flash("success_msg", "Valid OTP code");
      return res.render("resetPassword");
    }
  }

  async resetPassword(req, res, next) {
    const { email } = req.session.forgotpassword;
    const { newPassword, confirmNewPassword } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      req.flash(
        "error_msg",
        "Confirm password doesn't match password, please input again!"
      );
      return res.render("resetPassword");
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save().then((user) => {
      req.flash("success_msg", "Change password success, try login!");
      delete req.session.forgotpassword;
      return res.redirect("/users/login");
    });
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
