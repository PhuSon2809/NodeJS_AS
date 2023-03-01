const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { secrectKey } = require("../config/config");
const User = require("../model/users");
const jwt = require("jsonwebtoken");

var opts = {};
exports.getToken = function (user) {
  return jwt.sign(user, secrectKey, { expiresIn: 3600 });
};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken("Authorization");
opts.secretOrKey = secrectKey;

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findOne({ _id: payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        console.log(user);
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (!req.isAuthenticated()) {
        req.flash("error_msg", "Please log in first");
        return res.redirect("/users/login");
      } else {
        return next();
      }
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};
