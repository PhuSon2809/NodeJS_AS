module.exports = {
  ensureAuthenticated: function (req, res, next) {
    // Get the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      // Token not provided
      req.flash("error_msg", "Please log in first");
      return res.redirect("/users/login");
    }

    try {
      // Verify the JWT token and extract the user information from it
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;

      // Move to the next middleware function
      return next();
    } catch (err) {
      // Invalid token
      req.flash("error_msg", "Please log in first");
      return res.redirect("/users/login");
    }
  },
};
