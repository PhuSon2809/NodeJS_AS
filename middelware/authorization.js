exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    return next();
  }
  req.flash("error_msg", "You do not have permission to access this page");
  res.redirect("/");
};
