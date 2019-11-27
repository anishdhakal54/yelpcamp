var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require('../middleware')

router.get(
  "/campgrounds/:id/comments/new",
  middleware.isLoggedIn,
  (req, res) => {
    //find campground id
    campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", {
          campground: campground
        });
      }
    });
  }
);

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
  //lookup campground using id
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error","Sorry!! cannot perform operation");
          res.redirect("/campgrounds");
        } else {
          //   console.log(req.body.comment);

          //add username and id to the comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Comment added successfully");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect
});

router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.isLoggedIn,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      res.render("comments/edit", {
        data: foundComment,
        campground_id: req.params.id
      });
    });
  }
);

router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleware.isLoggedIn,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, foundComment) => {
        if (err) {
          req.flash("error","cannot edit comment");
          // console.log(err);
        } else {
          req.flash("success","comment edited successfully");
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.isLoggedIn,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
      req.flash("success","comment deleted successfully");
      res.redirect("/campgrounds/" + req.params.id);
    });
  }
);

module.exports = router;