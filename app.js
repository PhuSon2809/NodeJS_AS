var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const hbs = require("hbs");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");

require("./middelware/passport")(passport);
require('dotenv').config({ path: path.resolve(__dirname, 'config', 'config.env')});

var indexRouter = require("./routes/index");
const userRouter = require("./routes/userRouter");
const nationRouter = require("./routes/nationRouter");
const playerRouter = require("./routes/playerRouter");

const url = "mongodb://127.0.0.1:27017/footballPlayer";
const connect = mongoose.connect(url);

connect.then(
  (db) => {
    console.log("Connect correctly to server!");
  },
  (err) => {
    console.log(err);
  }
);

var app = express();
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// view engine setup
hbs.registerPartials(__dirname + "/views/patials");
hbs.registerHelper("stringify", function (obj) {
  return JSON.stringify(obj);
});
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});
hbs.registerHelper("toString", function (a) {
  return a.toString();
});
hbs.registerHelper("isNotEmpty", function (a) {
  return a && a.length > 0;
});
hbs.registerHelper("isTrue", function (a) {
  return a === true;
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/nations", nationRouter);
app.use("/players", playerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
