const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoose = require("mongoose");
var campground = require("./models/campground");
var Comment = require("./models/comments");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var seedDB = require("./seed");
var middleware = require("./middleware");
// var user = require("./models/user");

var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
// seedDB();

///PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "I am batman",
    resave: false,
    saveUninitialized: false
  })
);

app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
mongoose.connect("mongodb://localhost/yelpcamp", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.use(express.static(__dirname + "/public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");
// campground.create(
//   {
//     name: "Rara",
//     image:
//       "https://217354-660080-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2017/12/rara-lake-1170x540.jpg"
//   },
//   (err, Campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("added successfully.");
//       console.log(Campground);
//     }
//   }
// );

// Campground Routes

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);

app.listen(8000, (req, res) => {
  console.log("Server is running");
});