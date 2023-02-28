const passport = require("passport");
const bcrypt = require("bcrypt");
const Users = require("../model/users");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        //Match user
        Users.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "This username is not registed",
              });
            }
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                console.log(user);
                return done(null, user);
              } else {
                return done(null, false, { message: "Password is correct" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
