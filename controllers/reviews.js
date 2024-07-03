const Listings = require('../models/listings');
const Reviews = require('../models/reviews');


module.exports.CreateReview=async (req, res, next) => {
    try {
        const listing = await Listings.findById(req.params.id);
        const newReview = new Reviews(req.body.review);
        newReview.author=req.user._id;
        console.log(newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log("New review saved");
        req.flash("success","Your Review is successfully added!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(err);
    }
}

module.exports.destroyReview=async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success","Your Review is deleated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
}