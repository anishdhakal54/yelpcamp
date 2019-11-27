var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success","User Created successfully")
      res.redirect("/campgrounds");
    });
  });
});

//Show Login Form
router.get("/login", (req, res) => {
  res.render("login");
});

//Handelling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//Logout route
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success","Thank You for Visting");
  res.redirect("/campgrounds");
});

module.exports = router;