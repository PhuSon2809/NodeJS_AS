const passport = require("passport");
const bycrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/users");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        failureFlash: true,
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        // Match user
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              req.flash("error_msg", "This username is not registed");
              return done(null, false);
            }
            // Compare password
            bycrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                req.flash("error_msg", "Password is incorrect");
                return done(null, false);
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
