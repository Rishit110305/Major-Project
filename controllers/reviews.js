const Review = require("../models/review");
const Listing = require("../models/list");

module.exports.createReview =  async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Added !");
  res.redirect(`/listings/${listing._id}`);
  } catch(err) {
    next(err);
  }
  
}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "New Review Deleted !");
  res.redirect(`/listings/${id}`);
}