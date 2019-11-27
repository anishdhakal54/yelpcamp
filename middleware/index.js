var middlewareobj = {};

middlewareobj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "Please Login first");
    res.redirect("/login");
  }
};

module.exports = middlewareobj;