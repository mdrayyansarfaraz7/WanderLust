const express = require('express');
const router = express.Router({ mergeParams: true });
const Listings = require('../models/listings');
const Reviews = require('../models/reviews');
const { validateReviews, isLoggedIn } = require('../middleware');
const reviewController=require('../controllers/reviews.js')



router.post('/',isLoggedIn, validateReviews, reviewController.CreateReview);

router.delete('/:reviewId', reviewController.destroyReview);

module.exports = router;
