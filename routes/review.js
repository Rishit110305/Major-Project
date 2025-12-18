const express = require("express");
const router = express.Router({ mergeParams: true }); // imp 
const Listing = require("../models/list.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

// Reviews Route 
router.post("/", validateReview, isLoggedIn, reviewController.createReview);

// Delete Review Route 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);

module.exports = router;