var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require('../middleware')



router.get("/campgrounds", (req, res) => {
  campground.find({}, (err, allcamp) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campground: allcamp,
        currentUser: req.user
      });
    }
  });
});


router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/campgrounds/create", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var price=req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newcompound = {
    name: name,
    image: image,
    price:price,
    description: desc,
    author: author
  };
  campground.create(newcompound, (err, data) => {
    if (err) {
      req.flash("error","There was error creating Campground please try again later!!");
      res.redirect("back");
    } else {
      // console.log("New Campground created successfull");
      // console.log(data);
      req.flash("success","Campgrounnd created successfully");  
      res.redirect("/campgrounds");
    }
  });
});

router.get("/campgrounds/:id", (req, res) => {
  campground
    .findById(req.params.id)
    .populate("comments")
    .exec((err, data) => {
      if (err) {
        res.flash("error", "404 not found");
      } else {
        // console.log(data);
        res.render("campgrounds/show", {
          campground: data
        });
      }
    });
});

router.get("/campgrounds/:id/edit", middleware.isLoggedIn, (req, res) => {
  // console.log(req.params.id);
  var data = campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {
        data: foundCampground
      });
    }
  });
});

router.put("/campgrounds/:id", middleware.isLoggedIn, (req, res) => {
  campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        req.flash("success","Campground Edited Successfully");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

router.delete("/campgrounds/:id", middleware.isLoggedIn, (req, res) => {
  campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      // console.log(err);
      req.flash("error","Cannot delete campground");
      res.redirect("/campgrounds");
    } else {
      req.flash("success","Campground Deleted Successfully");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;